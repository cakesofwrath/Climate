import json


with open('giss_data.json') as f:
    data = json.load(f)

with open('giss_schema.json') as f:
    schema = json.load(f)
print data.keys()
def avg_year(index):
    return avg([data['tempanomaly'][index+i*len(schema['lon']) * len(schema['lat'])] for i in range(12) if data['tempanomaly'][index+i*len(schema['lon']) * len(schema['lat'])] is not None]) # fix iteration.

def avg(l):
    return float(sum(l)) / len(l) if len(l) > 0 else None

geoJSON = { 
    'type': 'FeatureCollection', 
    'features': [] 
    }
    
d = 2.5

lat = 0

while lat < len(schema['lat']):
    lon = 0
    while lon < len(schema['lon']):
        t = 0
        feature = { 
            'type': 'Feature', 
            'geometry': { 
                'type': 'Polygon',
                'coordinates': [
                    [
                        [int(data['lon'][lon]) + d, int(data['lon'][lon]) + d],
                        [int(data['lon'][lon]) + d, int(data['lon'][lon]) - d],
                        [int(data['lon'][lon]) - d, int(data['lon'][lon]) - d],
                        [int(data['lon'][lon]) - d, int(data['lon'][lon]) + d],
                        [int(data['lon'][lon]) + d, int(data['lon'][lon]) + d]
                    ]
                ]
            },
            'properties': {
                'temperature_anomaly': []    
            }
        }
        
        while t < len(schema['time']): # this b/c each geoJSON feature represents a timeseries
            feature['properties']['temperature_anomaly'].append(avg_year( t * len(schema['lon']) * len(schema['lat']) + lat * len(schema['lon']) + lon))
            t = t + (12 * 10)
        geoJSON['features'].append(feature)
        lon = lon + 1
    lat = lat + 1
    
with open('geoJSON/giss.json', 'w+') as f:
    json.dump(geoJSON, f)

