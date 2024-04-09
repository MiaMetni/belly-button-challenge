// THIS IS MY FIRST VERS. ... LONG (in terms of comments) AND REDUNDANT (in terms of repetition of code structures) 

// project goal: build an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels.
/* Use the D3 library to read in samples.json from the URL https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json. */

const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// First, create init function that will populate the dropdown, bar chart, and bubble chart with each sample's dataset
function init() {
    //create dropdown list variable for all sample id's in the dataset, append each ID as a new value
    let dropdown = d3.select("#selDataset");
    //access sample data using d3
    d3.json(url).then((data) => {
        //gather the sample ids from the names list in data and populate the dropdown
        let sample_ids = data.names;
        console.log(sample_ids);
        for (id of sample_ids) {
            dropdown.append("option").attr("value", id).text(id);
        };
        //store first sample for display initialization
        let first_entry = sample_ids[0];
        console.log(first_entry);

        //have the init() function call the graph generating functions with the first entry (id 940)
        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographics(first_entry);
    }); //end of d3 access
};

//populate the horizontal bar chart graph
function makeBar(sample) {
    //access sample data using d3 and populate
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //apply a filter on sample id
        let results = sample_data.filter(obj => obj.id === sample)[0];
        //store first 10 results to display in the bar chart
        let sample_values = results.sample_values.slice(0, 10).reverse();
        let otu_ids = results.otu_ids.slice(0, 10).map(item => `OTU ${item}`).reverse();
        let otu_labels = results.otu_labels.slice(0, 10).reverse();

        // Create a horizontal bar chart 
        // start by creating trace
        let bar_trace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: 'bar',
            orientation: 'h'
        };

        let layout = { title: "Top Ten OTUs" };
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

// make bubble map
function makeBubble(sample) {
    //access the sample data for populating the bubble chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //apply a filter that matches based on sample id
        let results = sample_data.filter(obj => obj.id === sample)[0];
        //store the results to display in the bubble chart
        let sample_values = results.sample_values;
        let otu_ids = results.otu_ids;
        let otu_labels = results.otu_labels;

        //start by creating trace
        let bubble_trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        // layout below
        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' }
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); //change html tag to 'bubble' in index.html
    });
};

// Display the sample metadata, i.e., an individual's demographic information.
//Make demographic info function to populate each sample's info
function makeDemographics(sample) {
    //access the sample data for populating the demographics section
    d3.json(url).then((data) => {
        //access the demographic info (metadata)
        let demographic_info = data.metadata;
        //apply a filter that matches based on sample id
        let results = demographic_info.filter(obj => obj.id === +sample)[0];
        //clear out previous entries in the demographic info section 
        let demographics_panel = d3.select('#sample-metadata');
        demographics_panel.html('');
        // Display each key-value pair from the metadata JSON object somewhere on the page.
        Object.entries(results).forEach(([key, value]) => {
            demographics_panel.append('p').text(`${key}: ${value}`);
        });
    });
};

//define the function when  dropdown detects change 
function optionChanged(value) {
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();
