import { StyleSheet } from 'react-native';

export const Colors = {
  bck: '#CAE9FF', // Light/white blue
  hdb: 'purple', // Header background xx find color
  shb: 'pink', // Subheader color xx find color
  prm: '#1B4965', // Dark blue
  scn: '#62B6CB', // Colorful blue (more turkish)
  trt: '#CB7762', // Random orange
  dgr: 'red', // For errors
  scs: 'green', // For success
  hov: '#5FA8D3', // Lighter colorful blue (more blue)
  lgt: '#BEE9E8', // Light/white green
  blk: '#000', // Black
  wht: '#FFF', // White
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bck,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 5,
    width: 200,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  header: {
    alignItems: 'center',
    fontWeight: 'bold',
    paddingBottom: 20,
    fontSize: 30,
    color: Colors.prm,
  },
  logo: {
    width: 114,
    height: 16,
    marginLeft: 10,
  },
  logout: { marginRight: 10 },
});
