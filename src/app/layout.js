import './globals.css';
import ApolloWrapper from './components/ApolloWrapper';

export const metadata = {
  title: 'Event Management Platform',
  description: 'Manage and participate in events globally',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
