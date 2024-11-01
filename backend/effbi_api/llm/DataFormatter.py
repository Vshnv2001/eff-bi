from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from .LLMManager import LLMManager
from .State import State
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class ChartType(Enum):
    AreaChartTemplate = "AreaChartTemplate"
    LineChartTemplate = "LineChartTemplate"
    BarChartTemplate = "BarChartTemplate"
    HorizontalBarChartTemplate = "HorizontalBarChartTemplate"
    PieChartTemplate = "PieChartTemplate"
    DonutChartTemplate = "DonutChartTemplate"
    PyramidBarChartTemplate = "PyramidBarChartTemplate"
    RadarChartTemplate = "RadarChartTemplate"
    RadarChartPolarTemplate = "RadarChartPolarTemplate"
    ScatterChartTemplate = "ScatterChartTemplate"
    CandlestickTemplate = "CandlestickTemplate"
    BoxPlotTemplate = "BoxPlotTemplate"
    TableTemplate = "TableTemplate"
    SingleValueTemplate = "SingleValueTemplate"


viz_props = {
    ChartType.AreaChartTemplate: {
        "chartSeries": [
            {"name": "", "data": []}
        ],
        "labels": []
    },
    ChartType.LineChartTemplate: {
        "series": [],
        "categories": [],
    },
    ChartType.BarChartTemplate: {
        "chartSeries": [
            {"name": "", "data": []}
        ],
        "categories": [],
    },
    ChartType.HorizontalBarChartTemplate: {
        "chartSeries": [
            {"name": "", "data": []}
        ],
        "categories": [],
    },
    ChartType.PieChartTemplate: {
        "series": [],
        "labels": []
    },
    ChartType.DonutChartTemplate: {
        "chartSeries": [],
        "labels": []
    },
    ChartType.PyramidBarChartTemplate: {
        "chartSeries": [
            {"name": "", "data": []}
        ],
        "categories": []
    },
    ChartType.RadarChartTemplate: {
        "series": [
            {"name": "", "data": []}
        ],
        "categories": [],
    },
    ChartType.RadarChartPolarTemplate: {
        "series": [],
    },
    ChartType.ScatterChartTemplate: {
        "series": [
            {"name": "", "data": [[]]}
        ],
    },
    ChartType.CandlestickTemplate: {
        "data": [
            {"x": "", "y": []},

        ],
    },
    ChartType.BoxPlotTemplate: {
        "data": [
            {"x": "", "y": []},
        ],
    },
    ChartType.TableTemplate: {
        "data": [
            {"label": "", "values": []},
            {"label": "", "values": []},
        ],
    },
    ChartType.SingleValueTemplate: {
        "value": "0",
        "title": "",
    },
}


class DataFormatter:
    def __init__(self, state: State):
        self.llm_manager = LLMManager()
        self.state = state

    def choose_visualization(self) -> dict:
        """Choose an appropriate visualization for the data."""
        question = self.state.question
        results = self.state.results
        sql_query = self.state.sql_query

        if results == "NOT_RELEVANT":
            return {"visualization": "none", "visualization_reasoning": "No visualization needed for irrelevant questions."}

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''
            You are an expert AI assistant that recommends appropriate data visualizations. Based on the user's question, SQL query, and query results, suggest the most suitable type of graph or chart to visualize the data. If no visualization is appropriate, indicate that.

            Available chart types and their use cases:
                - BarChartTemplate: Best for comparing categorical data or showing changes over time when categories are discrete and the number of categories is more than 2.
                - HorizontalBarChartTemplate: Best for comparing categorical data or showing changes over time when the number of categories is small or the disparity between categories is large.
                - PieChartTemplate: Ideal for showing proportions or percentages within a whole.
                - LineChartTemplate: Best for showing trends and distributions over time. Best used when both x-axis and y-axis are continuous.
                - AreaChartTemplate: Suitable for showing trends over time while emphasizing the magnitude of values.
                - DonutChartTemplate: A variation of the PieChart, useful for showing proportions, but allows for more data visualization in the center of the chart.
                - PyramidBarChartTemplate: Useful for visualizing distributions or hierarchies, especially in population pyramids or scenarios where one side represents one group and the other side another group.
                - RadarChartTemplate: Ideal for comparing multiple variables against each other in a circular layout, showing the strengths and weaknesses of each variable.
                - RadarChartPolarTemplate: Similar to a RadarChart, but with a polar grid for emphasizing categories with values on a continuous scale.
                - ScatterChartTemplate: Best for showing relationships between two variables and identifying correlations, trends, or outliers.
                - CandlestickTemplate: Commonly used in financial data to show price movements, particularly for stocks, over time. It emphasizes opening, closing, high, and low prices.
                - BoxPlotTemplate: Best for showing the distribution of data based on five summary statistics: minimum, first quartile, median, third quartile, and maximum.
                - TableTemplate: Best for showing data in a tabular format.
                - SingleValueTemplate: Best for showing a single value.
                
            Make sure that the chart type you choose is one of the above. 'HorizontalBarChartTemplate' is allowed but not 'HorizontalBarChartTemplate .'.
            Consider these types of questions when recommending a visualization:
            
            1. Aggregations and Summarizations: (e.g., "What is the average revenue by month?" - Line Chart)
            2. Comparisons: (e.g., "Compare the sales figures of Product A and Product B over the last year." - Line or Column Chart)
            3. Trends Over Time: (e.g., "What is the trend in the number of active users over the past year?" - Line Chart)
            4. Proportions: (e.g., "What is the market share of the products?" - Pie or Donut Chart)
            5. Emphasizing Total Values Over Time: (e.g., "What is the trend in monthly sales?" - Area Chart)
            6. Distributions and Outliers: (e.g., "What is the salary distribution across departments?" - BoxPlotTemplate)
            7. Categorical Data Comparisons: (e.g., "How do different product categories perform in sales?" - BarChartTemplate)
            8. Time Series Comparisons: (e.g., "Compare the sales trends of multiple products over the last year." - HorizontalBarChartTemplate)
            9. Relationships Between Variables: (e.g., "Is there a correlation between advertising spend and sales?" - ScatterChartTemplate)
            10. Variable Comparisons Across Categories: (e.g., "How does each department's performance compare across various metrics?" - RadarChartTemplate)
            11. Market Trends in Financial Data: (e.g., "What is the historical price movement of a stock?" - CandlestickTemplate)
            12. Demographic Distributions: (e.g., "What is the age distribution of customers?" - PyramidBarChartTemplate)
            13. Single Value: (e.g., "What is the total revenue?" - SingleValueTemplate)

            If a specific chart type is requested, utilize the corresponding template for that chart.
            For example, use PieChartTemplate for pie charts, BarChartTemplate for bar charts, and so on.
            
            Provide your response in the following format:
            Recommended Visualization: [Chart type or "None"]. ONLY use the above given names.
            Reason: [Brief explanation for your recommendation]
            '''),
            ("human", '''
            User question: {question}
            SQL query: {sql_query}
            Query results: {results}

            Recommend a visualization:'''),
        ])

        response = self.llm_manager.invoke(
            prompt, question=question, sql_query=sql_query, results=results)

        lines = response.split('\n')
        visualization = lines[0].split(': ')[1].strip()
        reason = lines[1].split(': ')[1].strip()

        return {"visualization": visualization, "visualization_reason": reason}

    def format_data_for_visualization(self) -> dict:
        """Format the data for the chosen visualization type."""
        visualization = self.state.visualization['visualization']
        results = self.state.results
        question = self.state.question
        sql_query = self.state.sql_query

        logger.info("chosen visualization: " + visualization)

        if visualization == "none":
            raise Exception(
                "We are unable to visualize the data. Please try a different question or provide more information.")

        visualization_props = viz_props[ChartType(visualization)]

        logger.info("visualization_props: ", visualization_props)
        prompt = ChatPromptTemplate.from_messages([
            ("system", '''
            You are an AI assistant that formats data for data visualizations.
            You are given the following data:
            - The SQL query that was used to get the data
            - The results of the SQL query
            - The type of visualization that was chosen and its props that we will use in the frontend
            - The user's question
            
            You need to format the data for the visualization. You will be given the visualization props that we will use in the frontend. Adhere to that only.
            
            Available chart types (in Javascript) Make sure to use the exact names ONLY:
            BarChartTemplate, HorizontalBarChartTemplate, PieChartTemplate, LineChartTemplate, AreaChartTemplate, DonutChartTemplate,
            PyramidBarChartTemplate, RadarChartTemplate, RadarChartPolarTemplate, ScatterChartTemplate, CandlestickTemplate, BoxPlotTemplate, TableTemplate

            Output format:
            {visualization_props}
            '''),
            ("human", '''
            SQL query: {sql_query}
            Query results: {results}
            Type of visualization: {visualization}
            User's question: {question}

            Format the data for the visualization:
            '''),
        ])

        logger.info("invoking llm_manager")
        try:
            response = self.llm_manager.invoke(prompt, visualization_props=visualization_props, sql_query=sql_query, results=results,
                                               visualization=visualization, question=question)
        except Exception as e:
            logger.info("Error invoking llm_manager: ", e)
            raise e

        logger.info("response: ", response)

        self.state.formatted_data = JsonOutputParser().parse(response)

        return {"formatted_data_for_visualization": self.state.formatted_data}
    
        
