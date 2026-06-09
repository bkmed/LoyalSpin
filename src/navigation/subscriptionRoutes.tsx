import PlanSelectionScreen from '../features/subscription/screens/PlanSelectionScreen';
import RegisterScreen from '../features/subscription/screens/RegisterScreen';
import EstablishmentScreen from '../features/subscription/screens/EstablishmentScreen';
import SummaryScreen from '../features/subscription/screens/SummaryScreen';
import PaymentScreen from '../features/subscription/screens/PaymentScreen';
import ProcessingScreen from '../features/subscription/screens/ProcessingScreen';
import SuccessScreen from '../features/subscription/screens/SuccessScreen';
import FailedScreen from '../features/subscription/screens/FailedScreen';

export const SUBSCRIPTION_ROUTES = [
  { name: 'Subscription.PlanSelection', component: PlanSelectionScreen },
  { name: 'Subscription.Register', component: RegisterScreen },
  { name: 'Subscription.Establishment', component: EstablishmentScreen },
  { name: 'Subscription.Summary', component: SummaryScreen },
  { name: 'Subscription.Payment', component: PaymentScreen },
  { name: 'Subscription.Processing', component: ProcessingScreen },
  { name: 'Subscription.Success', component: SuccessScreen },
  { name: 'Subscription.Failed', component: FailedScreen },
];

export default SUBSCRIPTION_ROUTES;
