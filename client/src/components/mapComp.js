import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComp = (props) => {
  
    return (
        <div className="mapComp">
        <p>This is Map section.</p>
        <Map center={[51.96849038866873,7.614555358886718]} zoom={10} maxZoom={18}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      
      {props.coord.map(item=>{
    let lng = `${item.metadata.location.coordinates[0]}`;
    let lat = `${item.metadata.location.coordinates[1]}`;
    let position = [lat, lng];
    return (
    <Marker key={`${item._id}`} position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )})
}
        </Map>
      </div>
    )
}

export default MapComp;

// import React, { Component } from 'react';
//import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

// type State = {
//   lat: number,
//   lng: number,
//   zoom: number,
// }

// export default class MapComp extends Component<{}, State> {
//   state = {
//     lat: 51.505,
//     lng: -0.09,
//     zoom: 13,
//   }

//   render() {
//     const position = [this.state.lat, this.state.lng]
//     return (
//       <Map center={position} zoom={this.state.zoom}>
//         <TileLayer
//           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position}>
//           <Popup>
//             A pretty CSS3 popup. <br /> Easily customizable.
//           </Popup>
//         </Marker>
//       </Map>
//     )
//   }
// }