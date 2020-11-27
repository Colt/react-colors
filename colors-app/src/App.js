import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Palette from "./Palette";
import PaletteList from "./PaletteList";
import SingleColorPalette from "./SingleColorPalette";
import Page from "./Page";
import NewPaletteForm from "./NewPaletteForm";
import seedColors from "./seedColors";
import { generatePalette } from "./colorHelpers";

class App extends Component {
  constructor(props) {
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
    this.state = { palettes: savedPalettes || seedColors };
    this.savePalette = this.savePalette.bind(this);
    this.findPalette = this.findPalette.bind(this);
    this.deletePalette = this.deletePalette.bind(this);
  }
  findPalette(id) {
    return this.state.palettes.find(function(palette) {
      return palette.id === id;
    });
  }
  deletePalette(id) {
    this.setState(
      st => ({ palettes: st.palettes.filter(palette => palette.id !== id) }),
      this.syncLocalStorage
    );
  }
  savePalette(newPalette) {
    this.setState(
      { palettes: [...this.state.palettes, newPalette] },
      this.syncLocalStorage
    );
  }
  syncLocalStorage() {
    //save palettes to local storage
    window.localStorage.setItem(
      "palettes",
      JSON.stringify(this.state.palettes)
    );
  }
  
  editPalette = (updatedPalette, previousId) => {
      // Delete that previous version of Palette which is updated
      const newPalettes = this.state.palettes.filter(
         (palette) => palette.id !== previousId
      );

      // console.log('newPalettes', newPalettes);

      // console.log('palettes: [newPalettes, updatedPalette]', [
      //    ...newPalettes,
      //    updatedPalette,
      // ]);
      // Add new Version of Palette to palettes
      this.setState({
         palettes: [...newPalettes, updatedPalette],
      });

      this.syncLocalStorage();

      // console.log('res.data', res.data);
   };

  render() {
    return (
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition key={location.key} classNames='page' timeout={500}>
              <Switch location={location}>
                <Route
                  exact
                  path='/palette/new'
                  render={routeProps => (
                    <Page>
                      <NewPaletteForm
                        savePalette={this.savePalette}
                        palettes={this.state.palettes}
                        {...routeProps}
                      />
                    </Page>
                  )}
                />

                <Route
                  exact
                  path='/updatePalette/:id'
                  render={(routeProps) => (
                    <Page>
                        <NewPaletteForm
                          savePalette={this.savePalette}
                          palettes={this.state.palettes}
                          {...routeProps}
                          updatePalette={true}
                          editPalette={this.editPalette}
                          currentPalette={this.state.palettes.find(
                              (palette) =>
                                palette.id ===
                                routeProps.match.params.id
                          )}
                        />
                    </Page>
                  )}
                />

                <Route
                  exact
                  path='/palette/:paletteId/:colorId'
                  render={routeProps => (
                    <Page>
                      <SingleColorPalette
                        colorId={routeProps.match.params.colorId}
                        palette={generatePalette(
                          this.findPalette(routeProps.match.params.paletteId)
                        )}
                      />
                    </Page>
                  )}
                />
                <Route
                  exact
                  path='/'
                  render={routeProps => (
                    <Page>
                      <PaletteList
                        palettes={this.state.palettes}
                        deletePalette={this.deletePalette}
                        {...routeProps}
                      />
                    </Page>
                  )}
                />
                <Route
                  exact
                  path='/palette/:id'
                  render={routeProps => (
                    <Page>
                      <Palette
                        palette={generatePalette(
                          this.findPalette(routeProps.match.params.id)
                        )}
                      />
                    </Page>
                  )}
                />
                <Route
                  render={routeProps => (
                    <Page>
                      <PaletteList
                        palettes={this.state.palettes}
                        deletePalette={this.deletePalette}
                        {...routeProps}
                      />
                    </Page>
                  )}
                />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    );
  }
}

export default App;
