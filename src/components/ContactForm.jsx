import { useState } from 'react'
export function ContactForm(){
    const [response, setResponse] = useState('')
    const [sendStatus, setSendStatus] = useState(false) 

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        const formData = Object.fromEntries(new window.FormData(event.target))
        const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData })
        }

        try {
            setSendStatus(true)      
            const statusEmail = await fetch('https://hfmexico.mx/foro-electromovilidad/backend/email/send-email-agrotech', requestOptions)
            const dataEmail = await statusEmail.json()
            if (dataEmail.status) {
                setSendStatus(false)
                setResponse('¡Gracias por contactarnos! En breve nos pondremos en contacto contigo.')
            } else {
                setSendStatus(false)
                setResponse('Lo sentimos en este momento no es posible enviar tu información...')
            }      
        } catch (error) {
            console.log(error)
            setSendStatus(false)
            setResponse('Lo sentimos en este momento no es posible enviar tu información...')
        }finally {
            setSendStatus(false);
            document.getElementById('form-contact').reset();
        }
    }

    return(
        <>
            <form id='form-contact' className="mt-10 space-y-10 w-8/12 mx-auto"  onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                        placeholder="name@flowbite.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-white">
                        Asunto
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Let us know how we can help you"
                        required
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-white">
                        Mensaje
                    </label>
                    <textarea
                        id="message"
                        rows="6"
                        name="message"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Leave a comment..."                        
                    >
                    </textarea>
                    </div>
                {
                  sendStatus 
                  ? 
                  <span className="text-white flex">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>                              
                    </svg> Enviando ...
                  </span>
                  :
                    <>
                      {
                        response === '' 
                        ?
                            <button
                            type="submit"
                            className="text-white bg-gray-900 hover:bg-blue-700 focus:ring-4 focus:outline-none 
                            focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                            Enviar
                            </button>
                        :
                          <span className="text-white font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mt-10 text-center">
                          {response}
                          </span>
                      }
                    </>
                }    
               
            </form>
        </>
    )
}