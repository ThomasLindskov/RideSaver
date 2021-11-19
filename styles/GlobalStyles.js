import { StyleSheet } from 'react-native';

export const Colors = {
  bck: '#CAE9FF', // Light/white blue
  hdb: 'purple', // Header background xx find color
  shb: 'pink', // Subheader color xx find color
  log: '#64EE85', // Logo green color
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

export const BrandColors = {
  //60%
  PrimaryDark: '#081F2E', // Text color: All whites, Two lightest secondary
  Primary: '#1B4965', // Text color: Two lightest whites, lightest secondary
  PrimaryLight: '#34769E', // Text color: Lightest whites, darkest greys

  //30%
  SecondaryDark: '#33A34E', // Text color: Ligthest white, darkest greys, darkest primary
  Secondary: '#64EE85', // Text color: Darkest primary, darkest grey
  SecondaryLight: '#A3FFB9', // Text color: Two darkest primaries, two darkest greys

  //10%
  GreyDark: '#1F2224', // Text color: All whites, two ligthestes secondaries, ligthest primary
  Grey: '#42484D', // Text color: ligthest white, two lightest secondaries
  GreyLight: '#636B73', // Text color: Ligthest secondary, lightest white

  //10%
  WhiteDark: '#B3C1C9', // Text color: Darkest primary, darkest grey
  White: '#D8DFE3', // All primaries, darkest grey
  WhiteLight: '#f0f3f5', // All primaries, two darkest greys
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.WhiteLight,
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
    color: BrandColors.Primary,
  },
  logo: {
    width: 114,
    height: 16,
    marginLeft: 10,
  },
  logout: { marginRight: 10 },
});
