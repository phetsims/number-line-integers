#!/usr/bin/env python
import cdsapi
c = cdsapi.Client()
c.retrieve(
  'reanalysis-era5-single-levels-monthly-means',
  {
    'product_type':'monthly_averaged_reanalysis',
    'variable':'2m_temperature',
    'grid':[1.0,1.0],
    'year':'2018',
    'month':'01',
    'time':'00:00',
    'format':'netcdf'
  },
  "download.nc"
)
