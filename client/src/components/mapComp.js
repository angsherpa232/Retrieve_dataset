import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComp = (props) => {
    return (
        <div className="mapComp">
        <Map center={[props.lat,props.lng]} zoom={props.zoom} maxZoom={18} useFlyTo={true}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      
      {props.response.map(item=>{
    let lng = `${item.metadata.location.coordinates[0]}`;
    let lat = `${item.metadata.location.coordinates[1]}`;
    let position = [lat, lng];
    return (
    <Marker key={`${item._id}`} position={position}>
          <Popup>
            {item.metadata.tags} <br /> {item.metadata.DateTime}
          </Popup>
        </Marker>
      )})
}
        </Map>
      </div>
    )
}

export default MapComp;
