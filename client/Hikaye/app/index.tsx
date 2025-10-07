import { Redirect } from 'expo-router';

export default function Index() {
  // Uygulama açılışında onboarding'e yönlendir
  return <Redirect href="/onboarding" />;
}

