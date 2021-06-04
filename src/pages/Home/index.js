import { Button, Paper } from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const Home = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
    },
  ];

  return (
    <div className={classes.mainContainer}>
      <Carousel>
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </Carousel>
    </div>
  );
};

function Item(props) {
  return (
    <Paper style={{ height: 600 }}>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>

      <Button>Check it out!</Button>
    </Paper>
  );
}

export default Home;
