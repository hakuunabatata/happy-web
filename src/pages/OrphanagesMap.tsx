import React, { useEffect, useState } from 'react'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import mapMarkerImg from '../images/map-marker.svg'

import '../styles/pages/orphanage-map.css'
import mapIcon from '../utils/mapIcon'
import api from '../services/api'

interface Orphanage {
    name: string
    id: number
    latitude: number
    longitude: number
}

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useEffect(() => {
        api.get('/orphanages').then(({ data }) => setOrphanages(data))
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :{')'}</p>
                </header>

                <footer>
                    <strong>Jundiaí</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>

            <Map
                center={[-23.1570551, -46.9707956]}
                zoom={15}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {orphanages.map(({ id, latitude, longitude, name }) => (
                    <Marker
                        key={id}
                        icon={mapIcon}
                        position={[latitude, longitude]}
                    >
                        <Popup
                            closeButton={false}
                            minWidth={240}
                            maxWidth={240}
                            className="map-popup"
                        >
                            {name}
                            <Link to={`/orphanages/${id}`}>
                                <FiArrowRight size={20} color="#FFF" />
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#fff" />
            </Link>
        </div>
    )
}

export default OrphanagesMap
