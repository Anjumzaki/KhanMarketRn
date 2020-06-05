import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    display: "flex",
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width
  },
  map: {
    flex: 1
  },
  mapMarkerContainer: {
    left: '45%',
    position: 'absolute',
    top: '50%'
  },
  mapMarker: {
    fontSize: 40,
    color: "red"
  },
  deatilSection: {
    flex: 1,
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btnContainer: {
    alignItems:'center',
  }
});