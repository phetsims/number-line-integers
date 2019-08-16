This file describes the process that was used to produce some of the more unusual assets used in this sim.

TODO: Add info about the piggy bank node creation.

Maps and Temperature Data for the "Temperature" scene of the "Scenes" screen.
=============================================================================

The website where the maps and temperature data was obtains is called the "Climate Data Store" at
https://cds.climate.copernicus.eu/cdsapp#!/home.  I (jbphet) learned just enough about how to use this to get what we
needed.  There is a lot to it, and there may be better and quicker ways to get the information needed, but this got the
job done.

Before doing any of this, you'll need to set up Python and pip on your machine if you don't already have it, then
Steps:
+ Create and download the map using the CDSToolbox and the Python code (TODO: put in final script name for getting the
images), adjusting the date as needed, to get one map per month.
+ Download the image, crop it, make the portions outside the map transparent (Photoshop was generally used for this)
+ Download data that matches the map by using the Python code and adjusting the date
+ The data set is higher resolution than we need, so to reduce it to a size that we can work with, take the following
steps
  + Install the NetCDF software utilities from UniData for manipulating NetCDF (.cd) files (you only need to do this
  once).  I (jbphet) installed the netCDF4 v4.7.0 without DAP (whatever that is) from
   https://www.unidata.ucar.edu/software/netcdf/docs/winbin.html
  + Convert the data set to 

The data and maps were retrieved using the CDS toolbox.  The scripts that were developed can be found...TODO: Decide
where to keep these and put them there!!!!!!!!!!!