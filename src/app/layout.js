import './globals.css';
import ApolloWrapper from './components/ApolloWrapper';
import Navbar from './components/navbar';


export const metadata = {
  title: 'Event Management Platform',
  description: 'Manage and participate in events globally',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <Navbar />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
