import usePersons from '../hooks/usePersons';

const Home = () => {
  const { persons } = usePersons();

  console.log(persons);

  return <h1>Home</h1>;
};

export default Home;
