import '@arcgis/map-components/components/arcgis-scale-bar';

function ScaleControl() {
  return (
    <div className="scale-control">
      <arcgis-scale-bar unit="dual" />
    </div>
  );
}

export default ScaleControl;
