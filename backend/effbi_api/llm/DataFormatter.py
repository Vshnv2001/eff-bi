import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from .LLMManager import LLMManager
from .State import State

from enum import Enum

class ChartType(Enum):
    LineChartTemplate = "LineChartTemplate"
    BarChartTemplate = "BarChartTemplate"
    HorizontalBarChartTemplate = "HorizontalBarChartTemplate"
    DonutChartTemplate = "DonutChartTemplate"
    AreaChartTemplate = "AreaChartTemplate"
    StackedGroupBarChartTemplate = "StackedGroupBarChartTemplate"
    PyramidBarChartTemplate = "PyramidBarChartTemplate"
    LineColumnChartTemplate = "LineColumnChartTemplate"
    MultipleYAxisLineChartTemplate = "MultipleYAxisLineChartTemplate"
    PieChartTemplate = "PieChartTemplate"
    RadarChartTemplate = "RadarChartTemplate"
    RadarChartMultipleTemplate = "RadarChartMultipleTemplate"
    RadarChartPolarTemplate = "RadarChartPolarTemplate"
    ScatterChartTemplate = "ScatterChartTemplate"
    CandlestickTemplate = "CandlestickTemplate"
    BoxPlotTemplate = "BoxPlotTemplate"



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
            You are an AI assistant that recommends appropriate data visualizations. Based on the user's question, SQL query, and query results, suggest the most suitable type of graph or chart to visualize the data. If no visualization is appropriate, indicate that.

            Available chart types (in Javascript) Make sure to use the exact names ONLY:
            LineChartTemplate, BarChartTemplate, HorizontalBarChartTemplate, DonutChartTemplate, AreaChartTemplate, StackedGroupBarChartTemplate, PyramidBarChartTemplate, LineColumnChartTemplate, MultipleYAxisLineChartTemplate, PieChartTemplate, RadarChartTemplate, RadarChartMultipleTemplate, RadarChartPolarTemplate, ScatterChartTemplate, CandlestickTemplate, BoxPlotTemplate
            
            Consider these types of questions when recommending a visualization:
            1. Aggregations and Summarizations (e.g., "What is the average revenue by month?" - Line Graph)
            2. Comparisons (e.g., "Compare the sales figures of Product A and Product B over the last year." - Line or Column Graph)
            3. Plotting Distributions (e.g., "Plot a distribution of the age of users" - Scatter Plot)
            4. Trends Over Time (e.g., "What is the trend in the number of active users over the past year?" - Line Graph)
            5. Proportions (e.g., "What is the market share of the products?" - Pie Chart)
            6. Correlations (e.g., "Is there a correlation between marketing spend and revenue?" - Scatter Plot)
            
            As much as possible, try to provide a visualization and try not to recommend none.

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

        response = self.llm_manager.invoke(prompt, question=question, sql_query=sql_query, results=results)
        
        lines = response.split('\n')
        visualization = lines[0].split(': ')[1]
        reason = lines[1].split(': ')[1]

        return {"visualization": visualization, "visualization_reason": reason}

            
        

    
    def format_data_for_visualization(self) -> dict:
        """Format the data for the chosen visualization type."""
        visualization = self.state.visualization['visualization']
        results = self.state.results
        question = self.state.question
        sql_query = self.state.sql_query
        
        print("chosen visualization: ", visualization)

        if visualization == "none":
            return {"formatted_data_for_visualization": None}
        
        if visualization == ChartType.ScatterChartTemplate:
            try:
                return self._format_scatter_data(results)
            except Exception as e:
                return self._format_other_visualizations(visualization, question, sql_query, results)
        
        if visualization == "BarChartTemplate" or visualization == "HorizontalBarChartTemplate":
            try:
                return self._format_bar_data(results, question)
            except Exception as e:
                return self._format_other_visualizations(visualization, question, sql_query, results)
        
        if visualization == ChartType.LineChartTemplate:
            try:
                return self._format_line_data(results, question)
            except Exception as e:
                return self._format_other_visualizations(visualization, question, sql_query, results)
        
        return self._format_other_visualizations(visualization, question, sql_query, results)
    
    def _format_line_data(self, results, question):
        if isinstance(results, str):
            results = eval(results)

        if len(results[0]) == 2:

            x_values = [str(row[0]) for row in results]
            y_values = [float(row[1]) for row in results]

            # Use LLM to get a relevant label
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a data labeling expert. Given a question and some data, provide a concise and relevant label for the data series."),
                ("human", "Question: {question}\n Data (first few rows): {data}\n\nProvide a concise label for this y axis. For example, if the data is the sales figures over time, the label could be 'Sales'. If the data is the population growth, the label could be 'Population'. If the data is the revenue trend, the label could be 'Revenue'."),
            ])
            label = self.llm_manager.invoke(prompt, question=question, data=str(results[:2]))

            formatted_data = {
                "xValues": x_values,
                "yValues": [
                    {
                        "data": y_values,
                        "label": label.strip()
                    }
                ]
            }
        elif len(results[0]) == 3:

            # Group data by label
            data_by_label = {}
            x_values = []

            # Get a list of unique labels
            labels = list(set(item2 for item1, item2, item3 in results 
                              if isinstance(item2, str) and not item2.replace(".", "").isdigit() and "/" not in item2))
            
            # If labels are not in the second position, check the first position
            if not labels:
                labels = list(set(item1 for item1, item2, item3 in results 
                                  if isinstance(item1, str) and not item1.replace(".", "").isdigit() and "/" not in item1))

            for item1, item2, item3 in results:
                # Determine which item is the label (string not convertible to float and not containing "/")
                if isinstance(item1, str) and not item1.replace(".", "").isdigit() and "/" not in item1:
                    label, x, y = item1, item2, item3
                else:
                    x, label, y = item1, item2, item3
                    

                if str(x) not in x_values:
                    x_values.append(str(x))
                if label not in data_by_label:
                    data_by_label[label] = []
                data_by_label[label].append(float(y))
                print(labels)
                for other_label in labels:
                    if other_label != label:
                        if other_label not in data_by_label:
                            data_by_label[other_label] = []
                        data_by_label[other_label].append(None)

            # Create yValues array
            y_values = [
                {
                    "data": data,
                    "label": label
                }
                for label, data in data_by_label.items()
            ]

            formatted_data = {
                "xValues": x_values,
                "yValues": y_values,
                "yAxisLabel": ""
            }

            # Use LLM to get a relevant label for the y-axis
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a data labeling expert. Given a question and some data, provide a concise and relevant label for the y-axis."),
                ("human", "Question: {question}\n Data (first few rows): {data}\n\nProvide a concise label for the y-axis. For example, if the data represents sales figures over time for different categories, the label could be 'Sales'. If it's about population growth for different groups, it could be 'Population'."),
            ])
            y_axis_label = self.llm_manager.invoke(prompt, question=question, data=str(results[:2]))

            # Add the y-axis label to the formatted data
            formatted_data["yAxisLabel"] = y_axis_label.strip()

        return {"formatted_data_for_visualization": formatted_data}

    def _format_scatter_data(self, results):
        if isinstance(results, str):
            results = eval(results)

        formatted_data = {"series": []}
        
        if len(results[0]) == 2:
            formatted_data["series"].append({
                "data": [
                    {"x": float(x), "y": float(y), "id": i+1}
                    for i, (x, y) in enumerate(results)
                ],
                "label": "Data Points"
            })
        elif len(results[0]) == 3:
            entities = {}
            for item1, item2, item3 in results:
                # Determine which item is the label (string not convertible to float and not containing "/")
                if isinstance(item1, str) and not item1.replace(".", "").isdigit() and "/" not in item1:
                    label, x, y = item1, item2, item3
                else:
                    x, label, y = item1, item2, item3
                if label not in entities:
                    entities[label] = []
                entities[label].append({"x": float(x), "y": float(y), "id": len(entities[label])+1})
            
            for label, data in entities.items():
                formatted_data["series"].append({
                    "data": data,
                    "label": label
                })
        else:
            raise ValueError("Unexpected data format in results")                

        return {"formatted_data_for_visualization": formatted_data}


    def _format_bar_data(self, results, question):
        if isinstance(results, str):
            results = eval(results)
            
        print("FORMAT BAR DATA RESULTS: ", results)

        if len(results[0]) == 2:
            # Simple bar chart with one series
            labels = [str(row[0]) for row in results]
            data = [float(row[1]) for row in results]
            
            # Use LLM to get a relevant label
            prompt = ChatPromptTemplate.from_messages([
                ("system", '''
                You are a data labeling expert. Given a question and some data, format the data, providing it labels for the y-axis and a series name for the x-axis in the following format:
                {"title": [title of the chart], "series": [{"data": [list of values for y-axis], "name": [series name for x-axis]}], "categories": [list of labels for x-axis]}
                An example is given below:
                {"title": "Top 5 Santa Sofia", "series": [{"data": [10, 41, 35, 51, 49, 62, 69, 91, 148], "name": "Desktops"}], "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
                '''),
                ("human", "Question: {question}\nData (first few rows): {data}\n\nProvide a concise label for this y axis. For example, if the data is the sales figures for products, the label could be 'Sales'. If the data is the population of cities, the label could be 'Population'. If the data is the revenue by region, the label could be 'Revenue'."),
            ])
            response = self.llm_manager.invoke(prompt, question=question, data=str(results[:2]))
            parsed_response = JsonOutputParser().parse(response)
            print("PARSED RESPONSE: ", parsed_response)
            return parsed_response
        # elif len(results[0]) == 3:
        #     # Grouped bar chart with multiple series
        #     categories = set(row[1] for row in results)
        #     labels = list(categories)
        #     entities = set(row[0] for row in results)
        #     values = []
        #     for entity in entities:
        #         entity_data = [float(row[2]) for row in results if row[0] == entity]
        #         values.append({"data": entity_data, "label": str(entity)})
        else:
            raise ValueError("Unexpected data format in results")

    def _format_other_visualizations(self, instructions, question, sql_query, results):
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Data expert who formats data according to the required needs. You are given the question asked by the user, it's sql query, the result of the query and the format you need to format it in."),
            ("human", 'For the given question: {question}\n\nSQL query: {sql_query}\n\Result: {results}\n\nUse the following example to structure the data: {instructions}. Just give the json string. Do not format it'),
        ])
        response = self.llm_manager.invoke(prompt, question=question, sql_query=sql_query, results=results, instructions=instructions)
            
        try:
            formatted_data_for_visualization = json.loads(response)
            return {"formatted_data_for_visualization": formatted_data_for_visualization}
        except json.JSONDecodeError:
            return {"error": "Failed to format data for visualization", "raw_response": response}
