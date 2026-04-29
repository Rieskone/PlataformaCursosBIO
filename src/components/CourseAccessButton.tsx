import { Button } from '@/components/Button';

type Props = {
  isLoggedIn: boolean;
  hasAccess: boolean;
  courseSlug: string;
};

const CourseAccessButton = ({ isLoggedIn, hasAccess, courseSlug }: Props) => {
  if (!isLoggedIn) {
    return <Button href="/login">Iniciar sesión para comprar</Button>;
  }

  if (!hasAccess) {
    return <Button href="#">Comprar curso</Button>;
  }

  return <Button href={`/aula/${courseSlug}`}>Entrar al aula</Button>;
};

export default CourseAccessButton;
