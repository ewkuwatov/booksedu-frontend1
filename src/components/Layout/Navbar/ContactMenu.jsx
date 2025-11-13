import { Headset } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'

const ContactMenu = () => {
  return (
    <div className="contactNav">
      <ul>
        <li>
          <Headset />
          <div className="callInfo">
            <p className="profileNavSpan">Call center</p>
            <p>+998 90 123-55-55</p>
          </div>
        </li>
        <li>
          <FontAwesomeIcon icon={faTelegram} />
          <div className="callInfo">
            <p className="profileNavSpan">Telegram Bot</p>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default ContactMenu
