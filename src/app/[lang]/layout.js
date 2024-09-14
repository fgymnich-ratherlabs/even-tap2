import './../globals.css';
import ApolloWrapper from '../components/ApolloWrapper';
import Navbar from '../components/navbar';
import { dir } from 'i18next';
import { i18n } from '../../i18n/next-i18next.config'

const languages = i18n.locales;

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export const metadata = {
  title: 'Event Management Platform',
  description: 'Manage and participate in events globally',
};

export default function RootLayout({ children, params: { lang } }) {
  return (
    <html lang={lang} dir={dir(lang)}>
      
      <body>
        <ApolloWrapper>
          <Navbar lang={lang}/>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}


