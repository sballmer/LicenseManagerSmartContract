import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export function LoaderBar({ color }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
}

export default LoaderBar;

// class LoaderText extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { dots: '', count: 0 };
//   }

//   componentDidMount() {
//     this.timerID = setInterval(() => this.tick(), 500);
//   }

//   componentWillUnmount() {
//     clearInterval(this.timerID);
//   }

//   tick() {
//     this.setState(prevState => {
//       if (prevState.count >= 5) {
//         return { dots: '', count: 0 }
//       }
//       return { dots: prevState.dots + '...', count: prevState.count + 1 };
//     });
//   }

//   render() {
//     return (
//       <div style={{ alignItems: 'center' }}>
//         <h2>Loading {this.state.dots}.</h2>
//       </div>
//     );
//   }
// }

// export default LoaderText;
