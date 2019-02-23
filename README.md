# Give Our Data - API

<<<<<<< HEAD
This RESTful API is based on the study carried out for partial fulfillment of the requirements for the degree of Master of Science in Geospatial Technologies at the [Institute for Geoinformatics](https://www.uni-muenster.de/Geoinformatics/en/) in 2018-19. The thesis is entitled **_"Querying with ease to retrieve spatial datasets through an Application Programming Interface (API)"._**  The main focus was to come up with easy and a user-friendly way of querying the datasets in terms of parameters namely SPACE, THEME, AND TIME from API level. Details about each parameter along with sample of different queries for respective number of parameter is given in this [documentation](https://documenter.getpostman.com/view/5553462/RzffJ9cc).

Click here for the [demo](https://giveourdata.herokuapp.com/api/).   
The front-end was developed with [React](https://reactjs.org/) to evaluate the learnability of the API developed for this study.  


=======
This RESTful API is based on the study carried out for partial fulfillment of the requirements for the degree of Master of Science in Geospatial Technologies at the [Institute for Geoinformatics](https://www.uni-muenster.de/Geoinformatics/en/) in 2018-19. The thesis is entitled **_"Querying with ease to retrieve spatial datasets through an Application Programming Interface (API)"._**  The main focus was to come up with easy and a user-friendly way of querying the datasets in terms of parameters namely SPACE, THEME, AND TIME from API level. Details about each parameter along with sample of different queries for respective number of parameter is given in this documentation.

### [SPACE]:
```
Space refers to the spatial attributes. This API takes the cityName as an Input. Currently, datasets are available for these cities only:

1. Bonn
2. Dortmund
3. Dusseldorf
4. Dresden
5. Kathmandu
6. Munster
7. Stuttgart
```
### [THEME]:
```
Theme refers to the thematic attributes. Currently datasets for following theme are available.
1. Population
2. Migration
3. Crime
4. Weather
5. Transport
6. Economy
7. Landuse
```
### [TIME]:
```
Time refers to the temporal attributes. Input parameter is Date. Users can express the date in natural language. For an example:
(without date ranges)
---
1. Today
2. Yesterday
3. Day before yesterday
4. Last month
5. Last year
6. 3 November 2017 or November 3rd 2017
---
(with date ranges)
---
1. last month to today
2. last year to last month
3. 16 november 2013 through 18 october 2017
```
---

## [Note]:
/api/all displays all the datasets currently available in the database.
>>>>>>> 9f6deb4391f4b732a74d53fb0e8b290227d326b9







