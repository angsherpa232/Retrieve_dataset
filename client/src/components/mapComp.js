import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComp = () => {
    const position = [51.505, -0.09]
    return (
        <div className="mapComp">
        <p>This is Map section.</p>
        <Map center={position} zoom={13} maxZoom={18}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
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