import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DesctopHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="desctopHeader">
      <span className="circle third"></span>
      <div className="headerInfo">
        <h1>{t('header_title')}</h1>
        <p>
          {t('header_text_prefix')}
          <span>{t('header_text_highlight')}</span>
          {t('header_text_suffix')}
        </p>
      </div>
      <div className="search">
        <Search color="#686868" />
        <input type="text" placeholder={t('search_placeholder')} />
        <div className="seacrhBtn">
          <p>{t('search_button')}</p>
        </div>
      </div>
    </div>
  )
}

export default DesctopHeader
