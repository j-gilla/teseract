# teseract


The aim is to be able to match a CV to a different CV or a Job Spec and determine the degree of compatibility using IBM Watson's natural language processing to identify similarity and patterns between the target datasets

There are 3 different settings which can be used:

1. getCommonKeywords: This allows to compare 2 cvs or 1 cv and 1 Job Spec and returns a set of common keywords. Watson analyses 2 datasets and extracts 2 sets of keywords. These are then filtered according to relevance and the function returns their intersection. 

2. getSimilarityPercentage: This allows to compare 2 cvs or 1 cv and 1 Job Spec and returns a fraction between between 0 and 1, which indicates the degree of similarity between the datasets. Watson analyses 2 datasets and extracts 2 sets of keywords. These are then turned into string and passed to an algorithm using Dice's Coefficient which returns their degree of similarity

3. getTopMatches: This allows to compare a set of CVs to a target CV or Job Spec and returns the top n results, sorted by similarity.  Watson analyses n datasets and extracts keywords form them. These are then turned into string and passed to an algorithm using Dice's Coefficient which returns the similarity of each string to the target string. The function then returns and object with the name of the files selected to be matched against the target and their degree of similarty.
