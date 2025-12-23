
// Importa React useState para manejar el estado local del formulario
import { useState } from 'react'
// Importa la lista de códigos de país
import { countrycodes } from '../lib/countrycodes'
// Importa el store de Zustand para manejar el estado global del formulario
import { useZustandStore } from '../store/form-store'


// Componente principal del formulario de contacto
export function ContactForm() {
  // Estado para el código de país seleccionado (por defecto México '52')
  const [selectedCountryCode, setSelectedCountryCode] = useState('52')
  // Estado para el número de teléfono ingresado
  const [phoneNumber, setPhoneNumber] = useState('')

  // Estado para la respuesta del servidor tras enviar el formulario
  const [response, setResponse] = useState('')
  // Estado para indicar si el formulario está enviando datos
  const [sendStatus, setSendStatus] = useState(false)

  // Maneja el cambio del código de país en el select
  const handleCountryCodeChange = (event) => {
    setSelectedCountryCode(event.target.value)
  }

  // Maneja el cambio en el input del número de teléfono
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
  }

  // Maneja el envío del formulario
  // Realiza una petición POST al servidor con los datos del formulario
  // Muestra mensajes de éxito o error según la respuesta
  const handleSubmit = async (event) => {
    event.preventDefault()
    // Obtiene los datos del formulario como objeto
    const formData = Object.fromEntries(new window.FormData(event.target))

    // Opciones para la petición fetch
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData }),
    }

    try {
      setSendStatus(true)
      // Envía los datos al endpoint del servidor
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
        // Actualiza el estado global con Zustand
        useZustandStore.setState({ zustandState: true })
        // Redirige a la página de agradecimiento
        window.location.href = '/gracias-por-contactarnos'
      } else {
        setSendStatus(false)
        setResponse(
          'Lo sentimos en este momento no es posible enviar tu información...'
        )
      }
    } catch (error) {
      // Manejo de errores en la petición
      console.log(error)
      setSendStatus(false)
      setResponse(
        'Lo sentimos en este momento no es posible enviar tu información...'
      )
    } finally {
      setSendStatus(false)
      // Resetea el formulario visualmente
      document.getElementById('form-contact').reset()
    }
  }

  return (
    <>
      {/* Formulario principal de contacto */}
      <form
        id='form-contact'
        className='mt-10 md:w-8/12 mx-auto space-y-5 bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-800'
        onSubmit={handleSubmit}
        aria-busy={sendStatus}
      >
        {/* Encabezado del formulario */}
        <div className='text-center mb-2'>
          <h2 className='text-white text-xl md:text-2xl font-semibold'>
            Contáctanos
          </h2>
          <p className='text-gray-300 text-sm mt-1'>
            Déjanos tus datos y te responderemos a la brevedad.
          </p>
        </div>

        {/* Empresa: Nombre de la empresa que desea participar. Obligatorio. */}
        <div>
          <label
            htmlFor='company'
            className='block mb-1 text-sm font-medium text-white'
          >
            <span>Empresa</span>
            <span className='' aria-hidden='true'>*</span>
          </label>
          <input
            type='text'
            id='company'
            name='company'
            className='shadow-sm bg-white border border-[#858C7E]/40 text-gray-900 text-sm rounded-lg focus:ring-[#1F5E00] focus:border-[#1F5E00] block w-full p-3'
            placeholder='Empresa S.A. de C.V.'
            required
            autoComplete='organization'
            aria-required='true'
          />
        </div>

        {/* Selector de sector */}
        <div>
          <label
            htmlFor='sector'
            className='block mb-1 text-sm font-medium text-white'
          >
            <span>Sector</span>
            <span className='' aria-hidden='true'>*</span>
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

        {/* Campo para el nombre del usuario */}
        <div>
          <label
            htmlFor='name'
            className='block mb-1 text-sm font-medium text-white'
          >
            <span>Nombre</span>
            <span className='' aria-hidden='true'>*</span>
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

        {/* Campo para el email del usuario */}
        <div>
          <label
            htmlFor='email'
            className='block mb-1 text-sm font-medium text-white'
          >
            <span>Email</span>
            <span className='' aria-hidden='true'>*</span>
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

        {/* Selector de código de país y campo de teléfono */}
        <div>
          <label
            htmlFor='countrycodes'
            className='block mb-1 text-sm font-medium text-white'
          >
            <span>Código de país + número de teléfono</span>
            <span className='' aria-hidden='true'>*</span>
          </label>
          <div className='w-full rounded-md flex gap-4'>
            {/* Selector de código de país */}
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
            {/* Input para el número de teléfono */}
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
              {/* Ayuda para el campo de teléfono */}
              <p id='phone-help' className='text-gray-400 text-xs mt-1'>
                Solo números, sin espacios ni símbolos.
              </p>
            </div>
          </div>
        </div>

        {/* Campo para el mensaje del usuario */}
        <div className='sm:col-span-2'>
          <label
            htmlFor='message'
            className='block mb-1 text-sm font-medium text-white'
          >
            <span>Mensaje</span>
            <span className='' aria-hidden='true'>*</span>
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

        {/* Indicador de envío o botón de enviar */}
        {sendStatus ? (
          // Muestra un spinner mientras se envía el formulario
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
          // Botón de enviar o mensaje de respuesta
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
              // Mensaje de respuesta tras enviar el formulario
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
