import { redirect } from 'next/navigation'

export default function Home() {
  //if (!login) {redirect('/login')}
  redirect('/signin');

}
