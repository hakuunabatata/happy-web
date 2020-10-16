import React, { FormEvent, useState, ChangeEvent } from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import { FiPlus } from 'react-icons/fi'

import '../styles/pages/create-orphanage.css'
import Sidebar from '../components/Sidebar'
import mapIcon from '../utils/mapIcon'
import api from '../services/api'
import { useHistory } from 'react-router-dom'

export default function CreateOrphanage() {
    const history = useHistory()

    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })

    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [instructions, setInstructions] = useState('')
    const [opening_hours, setOpeningHours] = useState('')
    const [open_on_weekends, setOpenOnWeekends] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])

    function mapClick(event: LeafletMouseEvent) {
        const { lat: latitude, lng: longitude } = event.latlng

        setLocation({
            latitude,
            longitude,
        })
    }

    async function submit(event: FormEvent) {
        event.preventDefault()

        const data = new FormData()

        data.append('latitude', String(location.latitude))
        data.append('longitude', String(location.longitude))
        data.append('name', name)
        data.append('about', about)
        data.append('instructions', instructions)
        data.append('opening_hours', opening_hours)
        data.append('open_on_weekends', String(open_on_weekends))
        images.forEach(image => data.append('images', image))

        await api.post('orphanages', data)

        alert(`🔥 ${name} Cadastrado com Sucesso`)

        history.push('/app')
    }

    function selectImages(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return

        const selectedImages = Array.from(event.target.files)

        setImages(selectedImages)

        const selectedImagesPreview = selectedImages.map(image =>
            URL.createObjectURL(image),
        )

        setPreviewImages(selectedImagesPreview)
    }

    return (
        <div id="page-create-orphanage">
            <Sidebar />

            <main>
                <form onSubmit={submit} className="create-orphanage-form">
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={[-23.1527246, -46.963221]}
                            style={{ width: '100%', height: 280 }}
                            zoom={15}
                            onclick={mapClick}
                        >
                            <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {location.latitude !== 0 && (
                                <Marker
                                    interactive={false}
                                    icon={mapIcon}
                                    position={[
                                        location.latitude,
                                        location.longitude,
                                    ]}
                                />
                            )}
                        </Map>

                        <div className="input-block">
                            <label htmlFor="name">Nome</label>
                            <input
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="about">
                                Sobre <span>Máximo de 300 caracteres</span>
                            </label>
                            <textarea
                                id="name"
                                maxLength={300}
                                value={about}
                                onChange={e => setAbout(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="images">Fotos</label>

                            <div className="images-container">
                                {previewImages.map(image => (
                                    <img key={image} src={image} alt={name} />
                                ))}
                                <label htmlFor="image[]" className="new-image">
                                    <FiPlus size={24} color="#15b6d6" />
                                </label>
                            </div>
                            <input
                                multiple
                                onChange={selectImages}
                                type="file"
                                name="image"
                                id="image[]"
                            />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Visitação</legend>

                        <div className="input-block">
                            <label htmlFor="instructions">Instruções</label>
                            <textarea
                                id="instructions"
                                value={instructions}
                                onChange={e => setInstructions(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="opening_hours">
                                Horário de funcionamento
                            </label>
                            <input
                                id="opening_hours"
                                value={opening_hours}
                                onChange={e => setOpeningHours(e.target.value)}
                            />
                        </div>

                        <div className="input-block">
                            <label htmlFor="open_on_weekends">
                                Atende fim de semana
                            </label>

                            <div className="button-select">
                                <button
                                    type="button"
                                    className={open_on_weekends ? 'active' : ''}
                                    onClick={() => setOpenOnWeekends(true)}
                                >
                                    Sim
                                </button>
                                <button
                                    type="button"
                                    className={
                                        !open_on_weekends ? 'active' : ''
                                    }
                                    onClick={() => setOpenOnWeekends(false)}
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <button className="confirm-button" type="submit">
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    )
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
