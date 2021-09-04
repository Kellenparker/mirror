import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h3 className="header" style={{
          color: "white",
          fontFamily: "helvetica",
          fontWeight: "lighter",
          fontSize: "50px",
          letterSpacing: "10px",
          textAlign: "center"
          }}>Hello World!</h3>
      </div>
    );
  }
}

export default App;