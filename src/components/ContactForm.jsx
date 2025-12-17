import { useState } from 'react'
import { countrycodes } from '../lib/countrycodes'
import { useZustandStore } from '../store/form-store'

export function ContactForm() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('52')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [response, setResponse] = useState('')
  const [sendStatus, setSendStatus] = useState(false)

  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new window.FormData(event.target))

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData }),
    }

    try {
      setSendStatus(true)
      const statusEmail = await fetch(
        'https://ecomondomexico.com.mx/server/expositor-landing-email',
        requestOptions
      )
      const dataEmail = await statusEmail.json()
      if (dataEmail.status) {
        setSendStatus(false)
        setResponse(
          '¡Gracias por contactarnos! En breve nos pondremos en contacto contigo.'
        )
        useZustandStore.setState({ zustandState: true })
        window.location.href = '/gracias-por-contactarnos'
      } else {
        setSendStatus(false)
        setResponse(
          'Lo sentimos en este momento no es posible enviar tu información...'
        )
      }
    } catch (error) {
      console.log(error)
      setSendStatus(false)
      setResponse(
        'Lo sentimos en este momento no es posible enviar tu información...'
      )
    } finally {
      setSendStatus(false)
      document.getElementById('form-contact').reset()
    }
  }

  return (
    <>
      <form
        id='form-contact'
        className='mt-10 md:w-8/12 mx-auto space-y-5 bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-800'
        onSubmit={handleSubmit}
        aria-busy={sendStatus}
      >
        <div className='text-center mb-2'>
          <h2 className='text-white text-xl md:text-2xl font-semibold'>
            Contáctanos
          </h2>
          <p className='text-gray-300 text-sm mt-1'>
            Déjanos tus datos y te responderemos a la brevedad.
          </p>
        </div>

        <div>
          <label
            htmlFor='sector'
            className='block mb-1 text-sm font-medium text-white'
          >
            Sector
          </label>
          <select
            id='sector'
            name='sector'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            required
            disabled={sendStatus}
          >
            <option value=''>Elige una opción</option>
            <option value='Manejo de residuos y economía circular'>
              Manejo de residuos y economía circular
            </option>
            <option value='Bioenergía'>Bioenergía</option>
            <option value='Cuidado y manejo del agua'>
              Cuidado y manejo del agua
            </option>
            <option value='Ciudades Sostenibles'>Ciudades Sostenibles</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='name'
            className='block mb-1 text-sm font-medium text-white'
          >
            Nombre
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            placeholder='John Doe'
            required
            autoComplete='name'
            disabled={sendStatus}
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block mb-1 text-sm font-medium text-white'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            placeholder='correo@ejemplo.com'
            required
            autoComplete='email'
            disabled={sendStatus}
          />
        </div>

        <div>
          <label
            htmlFor='countrycodes'
            className='block mb-1 text-sm font-medium text-white'
          >
            Código de país + número de teléfono
          </label>
          <div className='w-full rounded-md flex gap-4'>
            <div className='w-52'>
              <select
                className='block w-full p-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                value={selectedCountryCode}
                onChange={handleCountryCodeChange}
                required
                id='countrycodes'
                name='countrycodes'
                disabled={sendStatus}
              >
                <option value='52'>MX (52)</option>
                {countrycodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {`${country.iso} (${country.code})`}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <input
                className='block w-full p-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                type='tel'
                inputMode='tel'
                pattern='[0-9]{7,}'
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder='Ejemplo: 5512345678'
                required
                id='phone'
                name='phone'
                autoComplete='tel'
                aria-describedby='phone-help'
                disabled={sendStatus}
              />
              <p id='phone-help' className='text-gray-400 text-xs mt-1'>
                Solo números, sin espacios ni símbolos.
              </p>
            </div>
          </div>
        </div>

        <div className='sm:col-span-2'>
          <label
            htmlFor='message'
            className='block mb-1 text-sm font-medium text-white'
          >
            Mensaje
          </label>
          <textarea
            id='message'
            rows='6'
            name='message'
            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Déjanos saber cómo podemos ayudarte...'
            required
            disabled={sendStatus}
          ></textarea>
        </div>

        {sendStatus ? (
          <span
            className='text-white flex items-center'
            role='status'
            aria-live='polite'
          >
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Enviando...
          </span>
        ) : (
          <>
            {response === '' ? (
              <button
                type='submit'
                className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors'
                disabled={sendStatus}
              >
                Enviar
              </button>
            ) : (
              <span
                className='text-white font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mt-2 text-center block'
                role='status'
                aria-live='polite'
              >
                {response}
              </span>
            )}
          </>
        )}
      </form>
    </>
  )
}
