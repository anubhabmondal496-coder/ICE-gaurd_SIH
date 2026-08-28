from datetime import datetime, timezone
from typing import List, Dict
from app.models.satellite import SARPass, SARTarget, DataSourceStatus

class SatelliteService:
    """
    Manages Sentinel-1 SAR imagery acquisitions, target segmentation metadata,
    and external polar data source telemetry feeds.
    """
    def __init__(self):
        self._sar_passes: List[SARPass] = [
            SARPass(
                pass_id="S1A-EW-GRDM-20260828T061422",
                satellite="Sentinel-1A SAR",
                acquisition_time_utc="2026-08-28 06:14:22 UTC",
                polarization="HH+HV (Cross-Polarization)",
                resolution_m=40.0,
                swath_mode="Extra Wide (EW)",
                bbox=[-66.0, 42.0, -62.0, 50.0],
                detected_targets_count=4,
                targets=[
                    SARTarget(
                        target_id="SAR-TGT-001",
                        lat=-64.23,
                        lon=45.72,
                        length_m=17500.0,
                        width_m=8200.0,
                        area_sq_km=143.5,
                        radar_cross_section_db=18.4,
                        confidence_pct=98.6,
                        classification="Tabular Mega-Iceberg",
                        matched_iceberg_id="A76C"
                    ),
                    SARTarget(
                        target_id="SAR-TGT-002",
                        lat=-64.12,
                        lon=45.95,
                        length_m=1200.0,
                        width_m=850.0,
                        area_sq_km=1.02,
                        radar_cross_section_db=12.1,
                        confidence_pct=91.4,
                        classification="Calved Fragment (Bergy Bit)",
                        matched_iceberg_id=None
                    ),
                    SARTarget(
                        target_id="SAR-TGT-003",
                        lat=-64.55,
                        lon=45.10,
                        length_m=3400.0,
                        width_m=1800.0,
                        area_sq_km=6.12,
                        radar_cross_section_db=14.8,
                        confidence_pct=94.2,
                        classification="Medium Tabular Iceberg",
                        matched_iceberg_id=None
                    ),
                    SARTarget(
                        target_id="SAR-TGT-004",
                        lat=-63.85,
                        lon=46.20,
                        length_m=950.0,
                        width_m=620.0,
                        area_sq_km=0.58,
                        radar_cross_section_db=10.5,
                        confidence_pct=88.7,
                        classification="Growler Cluster",
                        matched_iceberg_id=None
                    )
                ]
            ),
            SARPass(
                pass_id="S1B-IW-GRDH-20260828T075210",
                satellite="Sentinel-1B SAR",
                acquisition_time_utc="2026-08-28 07:52:10 UTC",
                polarization="HH (Single Polarization)",
                resolution_m=10.0,
                swath_mode="Interferometric Wide (IW)",
                bbox=[-62.0, -52.0, -59.0, -45.0],
                detected_targets_count=1,
                targets=[
                    SARTarget(
                        target_id="SAR-TGT-010",
                        lat=-60.85,
                        lon=-48.30,
                        length_m=68000.0,
                        width_m=42000.0,
                        area_sq_km=2856.0,
                        radar_cross_section_db=24.2,
                        confidence_pct=99.9,
                        classification="Mega Tabular Iceberg (A23A Main)",
                        matched_iceberg_id="A23A"
                    )
                ]
            )
        ]

        self._data_sources: List[DataSourceStatus] = [
            DataSourceStatus(
                name="U.S. National Ice Center (USNIC)",
                agency="NOAA / US Navy / USCG",
                dataset_type="Antarctic Iceberg Tracking & Named Database",
                variables=["Iceberg ID", "Centroid Coordinates", "Length/Width", "Calving Source", "Track History"],
                update_frequency="Daily / Weekly",
                last_ingested_utc=datetime.now(timezone.utc).strftime("%Y-%m-%d 08:30 UTC"),
                status="OPERATIONAL",
                latency_seconds=42,
                data_quality_pct=99.4,
                api_endpoint="https://usicecenter.gov/Products/AntarcticIcebergs"
            ),
            DataSourceStatus(
                name="Copernicus Marine Service (CMEMS)",
                agency="European Space Agency (ESA) / Mercator Ocean",
                dataset_type="GLOBAL_ANALYSISFORECAST_PHY_001_024",
                variables=["3D Ocean Current Velocity (u, v)", "Sea Surface Temperature (SST)", "Sea Surface Salinity", "Mixed Layer Depth"],
                update_frequency="Hourly / 6-Hourly",
                last_ingested_utc=datetime.now(timezone.utc).strftime("%Y-%m-%d 09:00 UTC"),
                status="OPERATIONAL",
                latency_seconds=18,
                data_quality_pct=98.8,
                api_endpoint="https://marine.copernicus.eu/services-portfolio"
            ),
            DataSourceStatus(
                name="ECMWF ERA5 Atmospheric Reanalysis",
                agency="European Centre for Medium-Range Weather Forecasts",
                dataset_type="ERA5 Hourly Global Atmospheric Forcing",
                variables=["10m Surface Wind Speed & Direction", "Mean Sea Level Pressure", "Air Temp at 2m", "Boundary Layer Shear"],
                update_frequency="Hourly Forecast Grid",
                last_ingested_utc=datetime.now(timezone.utc).strftime("%Y-%m-%d 09:15 UTC"),
                status="OPERATIONAL",
                latency_seconds=25,
                data_quality_pct=99.1,
                api_endpoint="https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels"
            ),
            DataSourceStatus(
                name="National Snow and Ice Data Center (NSIDC)",
                agency="NASA / NOAA / CU Boulder",
                dataset_type="Near-Real-Time Polar Sea Ice Concentration",
                variables=["Sea Ice Concentration (%)", "Ice Edge Extent", "Sea Ice Age & Thickness"],
                update_frequency="Daily 12.5km Resolution Grid",
                last_ingested_utc=datetime.now(timezone.utc).strftime("%Y-%m-%d 07:00 UTC"),
                status="OPERATIONAL",
                latency_seconds=55,
                data_quality_pct=97.9,
                api_endpoint="https://nsidc.org/data/masie"
            ),
            DataSourceStatus(
                name="Copernicus Sentinel-1 SAR Constellation",
                agency="European Space Agency (ESA)",
                dataset_type="C-band Synthetic Aperture Radar Level-1 GRD",
                variables=["Radar Backscatter Coefficient (sigma-0)", "Dual-polarization ratio", "Iceberg Edge Segmentation"],
                update_frequency="Orbital Pass (Every 3-5 days per sector)",
                last_ingested_utc=datetime.now(timezone.utc).strftime("%Y-%m-%d 06:14 UTC"),
                status="OPERATIONAL",
                latency_seconds=310,
                data_quality_pct=99.7,
                api_endpoint="https://scihub.copernicus.eu/dhus"
            )
        ]

    def get_sar_passes(self) -> List[SARPass]:
        return self._sar_passes

    def get_data_sources(self) -> List[DataSourceStatus]:
        return self._data_sources

satellite_service = SatelliteService()
