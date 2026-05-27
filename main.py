from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path
import textwrap


def xml_escape(value: object) -> str:
    text = str(value)
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


@dataclass
class PipingSystem:
    name: str
    process_fluid: str
    pressure_bar: float
    temp_c: float
    pipe_schedule: str
    pipe_material: str
    flow_rate_m3h: float
    has_pump: bool
    has_valve: bool
    has_heat_exchanger: bool
    has_flow_meter: bool
    has_pressure_relief: bool
    has_check_valve: bool = False
    has_temp_transmitter: bool = False
    has_pressure_transmitter: bool = False


class PIDSchematic:
    SVG_WIDTH = 1200
    SVG_HEIGHT = 400
    PIPE_Y = 200

    def __init__(self, system: PipingSystem, loop_number: int = 100) -> None:
        self.system = system
        self.loop_number = loop_number
        self._tag_list: list[dict] | None = None

    def _line_designation(self) -> str:
        return (
            f"{self.system.pipe_schedule}-"
            f"{self.system.process_fluid[:3].upper()}-"
            f"{self.loop_number}-"
            f"{self.system.pipe_material}"
        )

    def generate_tag_list(self) -> list[dict]:
        service = self.system.process_fluid
        line_designation = self._line_designation()
        tags: list[dict] = []

        def add_tag(tag: str, item_type: str, spec_note: str) -> None:
            tags.append(
                {
                    "tag": tag,
                    "type": item_type,
                    "service": service,
                    "line_designation": line_designation,
                    "spec_note": spec_note,
                }
            )

        if self.system.has_pump:
            add_tag(
                f"P-{self.loop_number}A",
                "Centrifugal Pump",
                f"Primary transfer duty at {self.system.flow_rate_m3h:.1f} m3/h",
            )
        if self.system.has_flow_meter:
            add_tag(
                f"FT-{self.loop_number + 1}",
                "Flow Transmitter",
                f"Design flow {self.system.flow_rate_m3h:.1f} m3/h",
            )
        if self.system.has_valve:
            add_tag(
                f"FCV-{self.loop_number + 1}",
                "Flow Control Valve",
                "Modulating service on main process line",
            )
        if self.system.has_heat_exchanger:
            add_tag(
                f"HE-{self.loop_number}",
                "Shell & Tube Heat Exchanger",
                f"Thermal service for {service}",
            )
        if self.system.has_pressure_relief:
            add_tag(
                f"PSV-{self.loop_number + 2}",
                "Pressure Safety Valve",
                f"Set pressure {self.system.pressure_bar * 1.1:.2f} bar",
            )
        if self.system.has_check_valve:
            add_tag(
                f"CV-{self.loop_number + 3}",
                "Check Valve",
                "Prevents reverse flow",
            )
        if self.system.has_temp_transmitter:
            add_tag(
                f"TT-{self.loop_number + 4}",
                "Temperature Transmitter",
                f"Design temperature {self.system.temp_c:.1f} C",
            )
        if self.system.has_pressure_transmitter:
            add_tag(
                f"PT-{self.loop_number + 5}",
                "Pressure Transmitter",
                f"Design pressure {self.system.pressure_bar:.1f} bar",
            )

        self._tag_list = tags
        return tags

    def _tags(self) -> list[dict]:
        return self._tag_list if self._tag_list is not None else self.generate_tag_list()

    def _component_positions(self, count: int) -> list[float]:
        if count <= 0:
            return []
        if count == 1:
            return [600.0]

        left = 160.0
        right = 1040.0
        step = (right - left) / (count - 1)
        return [left + (step * index) for index in range(count)]

    def _symbol_kind(self, item_type: str) -> str:
        mapping = {
            "Centrifugal Pump": "pump",
            "Flow Transmitter": "flow_meter",
            "Flow Control Valve": "control_valve",
            "Shell & Tube Heat Exchanger": "heat_exchanger",
            "Pressure Safety Valve": "pressure_relief",
            "Check Valve": "check_valve",
            "Temperature Transmitter": "temp_transmitter",
            "Pressure Transmitter": "pressure_transmitter",
        }
        return mapping[item_type]

    def _draw_symbol(self, kind: str, cx: float, cy: float) -> tuple[list[str], float]:
        x = f"{cx:.1f}"
        y = f"{cy:.1f}"
        parts: list[str] = []
        lead_start_y = cy - 24

        if kind == "pump":
            lead_start_y = cy - 28
            parts.append(
                f'<circle cx="{x}" cy="{y}" r="28" fill="lightblue" stroke="black" stroke-width="2" />'
            )
            parts.append(
                "<polygon "
                f'points="{cx - 10:.1f},{cy - 12:.1f} {cx - 10:.1f},{cy + 12:.1f} {cx + 14:.1f},{cy:.1f}" '
                'fill="black" stroke="black" stroke-width="1" />'
            )
        elif kind == "control_valve":
            lead_start_y = cy - 18
            parts.append(
                "<polygon "
                f'points="{cx - 28:.1f},{cy - 16:.1f} {cx:.1f},{cy:.1f} {cx - 28:.1f},{cy + 16:.1f}" '
                'fill="orange" stroke="black" stroke-width="2" />'
            )
            parts.append(
                "<polygon "
                f'points="{cx + 28:.1f},{cy - 16:.1f} {cx:.1f},{cy:.1f} {cx + 28:.1f},{cy + 16:.1f}" '
                'fill="orange" stroke="black" stroke-width="2" />'
            )
        elif kind == "check_valve":
            lead_start_y = cy - 18
            parts.append(
                "<polygon "
                f'points="{cx - 24:.1f},{cy - 16:.1f} {cx + 18:.1f},{cy:.1f} {cx - 24:.1f},{cy + 16:.1f}" '
                'fill="lightyellow" stroke="black" stroke-width="2" />'
            )
            parts.append(
                f'<line x1="{cx + 4:.1f}" y1="{cy - 18:.1f}" x2="{cx + 4:.1f}" y2="{cy + 18:.1f}" '
                'stroke="black" stroke-width="2" />'
            )
        elif kind == "heat_exchanger":
            lead_start_y = cy - 25
            parts.append(
                f'<rect x="{cx - 40:.1f}" y="{cy - 25:.1f}" width="80" height="50" '
                'fill="lightyellow" stroke="black" stroke-width="2" />'
            )
            parts.append(
                f'<line x1="{cx - 34:.1f}" y1="{cy - 19:.1f}" x2="{cx + 34:.1f}" y2="{cy + 19:.1f}" '
                'stroke="black" stroke-width="2" />'
            )
            parts.append(
                f'<line x1="{cx + 34:.1f}" y1="{cy - 19:.1f}" x2="{cx - 34:.1f}" y2="{cy + 19:.1f}" '
                'stroke="black" stroke-width="2" />'
            )
        elif kind == "flow_meter":
            lead_start_y = cy - 24
            parts.append(
                f'<circle cx="{x}" cy="{y}" r="24" fill="lightgreen" stroke="black" stroke-width="2" />'
            )
            parts.append(
                f'<text x="{x}" y="{cy + 1:.1f}" font-size="14" font-weight="bold" '
                'font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">FT</text>'
            )
        elif kind == "pressure_relief":
            lead_start_y = cy - 30
            parts.append(
                "<polygon "
                f'points="{cx - 22:.1f},{cy + 18:.1f} {cx + 22:.1f},{cy + 18:.1f} {cx:.1f},{cy - 30:.1f}" '
                'fill="red" stroke="darkred" stroke-width="2" />'
            )
        elif kind == "temp_transmitter":
            lead_start_y = cy - 20
            parts.append(
                f'<circle cx="{x}" cy="{y}" r="20" fill="lightyellow" stroke="black" stroke-width="2" />'
            )
            parts.append(
                f'<text x="{x}" y="{cy + 1:.1f}" font-size="12" font-weight="bold" '
                'font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">TT</text>'
            )
        elif kind == "pressure_transmitter":
            lead_start_y = cy - 20
            parts.append(
                f'<circle cx="{x}" cy="{y}" r="20" fill="lightcyan" stroke="black" stroke-width="2" />'
            )
            parts.append(
                f'<text x="{x}" y="{cy + 1:.1f}" font-size="12" font-weight="bold" '
                'font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">PT</text>'
            )
        else:
            raise ValueError(f"Unsupported symbol kind: {kind}")

        return parts, lead_start_y

    def _draw_legend_symbol(self, kind: str, cx: float, cy: float) -> str:
        if kind == "pump":
            return (
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="lightblue" stroke="black" stroke-width="1.5" />'
                f'<polygon points="{cx - 3:.1f},{cy - 4:.1f} {cx - 3:.1f},{cy + 4:.1f} {cx + 5:.1f},{cy:.1f}" '
                'fill="black" stroke="black" stroke-width="0.5" />'
            )
        if kind == "control_valve":
            return (
                f'<polygon points="{cx - 10:.1f},{cy - 6:.1f} {cx:.1f},{cy:.1f} {cx - 10:.1f},{cy + 6:.1f}" '
                'fill="orange" stroke="black" stroke-width="1" />'
                f'<polygon points="{cx + 10:.1f},{cy - 6:.1f} {cx:.1f},{cy:.1f} {cx + 10:.1f},{cy + 6:.1f}" '
                'fill="orange" stroke="black" stroke-width="1" />'
            )
        if kind == "check_valve":
            return (
                f'<polygon points="{cx - 9:.1f},{cy - 6:.1f} {cx + 8:.1f},{cy:.1f} {cx - 9:.1f},{cy + 6:.1f}" '
                'fill="lightyellow" stroke="black" stroke-width="1" />'
                f'<line x1="{cx + 1:.1f}" y1="{cy - 7:.1f}" x2="{cx + 1:.1f}" y2="{cy + 7:.1f}" '
                'stroke="black" stroke-width="1" />'
            )
        if kind == "heat_exchanger":
            return (
                f'<rect x="{cx - 10:.1f}" y="{cy - 7:.1f}" width="20" height="14" fill="lightyellow" '
                'stroke="black" stroke-width="1" />'
                f'<line x1="{cx - 8:.1f}" y1="{cy - 5:.1f}" x2="{cx + 8:.1f}" y2="{cy + 5:.1f}" '
                'stroke="black" stroke-width="1" />'
                f'<line x1="{cx + 8:.1f}" y1="{cy - 5:.1f}" x2="{cx - 8:.1f}" y2="{cy + 5:.1f}" '
                'stroke="black" stroke-width="1" />'
            )
        if kind == "flow_meter":
            return (
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="lightgreen" stroke="black" stroke-width="1.5" />'
                f'<text x="{cx:.1f}" y="{cy + 0.5:.1f}" font-size="5.5" font-weight="bold" '
                'font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">FT</text>'
            )
        if kind == "pressure_relief":
            return (
                f'<polygon points="{cx - 8:.1f},{cy + 6:.1f} {cx + 8:.1f},{cy + 6:.1f} {cx:.1f},{cy - 8:.1f}" '
                'fill="red" stroke="darkred" stroke-width="1" />'
            )
        if kind == "temp_transmitter":
            return (
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="lightyellow" stroke="black" stroke-width="1.5" />'
                f'<text x="{cx:.1f}" y="{cy + 0.5:.1f}" font-size="5.5" font-weight="bold" '
                'font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">TT</text>'
            )
        if kind == "pressure_transmitter":
            return (
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="lightcyan" stroke="black" stroke-width="1.5" />'
                f'<text x="{cx:.1f}" y="{cy + 0.5:.1f}" font-size="5.5" font-weight="bold" '
                'font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">PT</text>'
            )
        raise ValueError(f"Unsupported legend symbol kind: {kind}")

    def _legend_items(self) -> list[tuple[str, str]]:
        return [
            ("pump", "Pump"),
            ("control_valve", "Control Valve"),
            ("check_valve", "Check Valve"),
            ("heat_exchanger", "Heat Exchanger"),
            ("flow_meter", "Flow Meter"),
            ("pressure_relief", "Relief Valve"),
            ("temp_transmitter", "Temp Tx"),
            ("pressure_transmitter", "Press Tx"),
        ]

    def _print_tag_list(self, tags: list[dict]) -> None:
        inner_width = 54
        row_format = "  {tag:<10}  {type:<24}  {service:<14}"

        def border(left: str, fill: str, right: str) -> str:
            return f"{left}{fill * inner_width}{right}"

        def row(content: str) -> str:
            return f"║{content.ljust(inner_width)}║"

        title_prefix = "  P&ID TAG LIST — "
        title_width = inner_width - len(title_prefix)
        title_name = textwrap.shorten(
            self.system.name,
            width=title_width,
            placeholder="...",
        )

        print(border("╔", "═", "╗"))
        print(row(f"{title_prefix}{title_name}"))
        print(border("╠", "═", "╣"))
        print(
            row(
                row_format.format(
                    tag="TAG",
                    type="TYPE",
                    service="SERVICE",
                )
            )
        )
        print(row(f"  {'─' * 50}  "))
        for item in tags:
            item_type = textwrap.shorten(item["type"], width=24, placeholder="...")
            service = textwrap.shorten(item["service"], width=14, placeholder="...")
            print(
                row(
                    row_format.format(
                        tag=item["tag"][:10],
                        type=item_type,
                        service=service,
                    )
                )
            )
        print(border("╚", "═", "╝"))

    def generate_svg(self, output_path: str) -> str:
        tags = self._tags()
        positions = self._component_positions(len(tags))
        title = textwrap.shorten(self.system.name, width=42, placeholder="...")
        subtitle = (
            f"Fluid: {self.system.process_fluid} | "
            f"P: {self.system.pressure_bar:.1f} bar | "
            f"T: {self.system.temp_c:.1f} C | "
            f"Line: {self._line_designation()}"
        )

        parts: list[str] = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" '
            'viewBox="0 0 1200 400">',
            '<rect x="0" y="0" width="1200" height="400" fill="white" />',
            '<rect x="40" y="5" width="1120" height="50" rx="6" ry="6" fill="#f3f6fa" stroke="black" stroke-width="1.5" />',
            f'<text x="60" y="26" font-size="20" font-weight="bold" font-family="Arial, sans-serif">{xml_escape(title)}</text>',
            f'<text x="60" y="43" font-size="12" font-family="Arial, sans-serif">{xml_escape(subtitle)}</text>',
            '<line x1="60" y1="200" x2="1140" y2="200" stroke="black" stroke-width="4" />',
        ]

        for x_pos, item in zip(positions, tags):
            kind = self._symbol_kind(item["type"])
            symbol_parts, lead_start_y = self._draw_symbol(kind, x_pos, self.PIPE_Y)
            parts.extend(symbol_parts)
            parts.append(
                f'<line x1="{x_pos:.1f}" y1="{lead_start_y:.1f}" x2="{x_pos:.1f}" y2="120" '
                'stroke="black" stroke-width="1.5" stroke-dasharray="5,4" />'
            )
            parts.append(
                f'<circle cx="{x_pos:.1f}" cy="98" r="22" fill="white" stroke="black" stroke-width="1.5" />'
            )
            parts.append(
                f'<text x="{x_pos:.1f}" y="99" font-size="10" font-family="monospace" '
                f'text-anchor="middle" dominant-baseline="middle">{xml_escape(item["tag"])}</text>'
            )
            parts.append(
                f'<text x="{x_pos:.1f}" y="260" font-size="11" font-family="monospace" '
                f'text-anchor="middle">{xml_escape(item["tag"])}</text>'
            )

        parts.append(
            '<text x="60" y="320" font-size="12" font-family="Arial, sans-serif">'
            f'{xml_escape(f"Flow: {self.system.flow_rate_m3h:.1f} m3/h | Material: {self.system.pipe_material} | Schedule: {self.system.pipe_schedule}")}'
            '</text>'
        )

        legend_x = 900
        legend_y = 290
        parts.append(
            f'<rect x="{legend_x}" y="{legend_y}" width="280" height="100" rx="6" ry="6" '
            'fill="#fafafa" stroke="black" stroke-width="1.2" />'
        )
        parts.append(
            f'<text x="{legend_x + 12}" y="{legend_y + 18}" font-size="12" font-weight="bold" '
            'font-family="Arial, sans-serif">Legend</text>'
        )

        for index, (kind, label) in enumerate(self._legend_items()):
            column = index // 4
            row = index % 4
            symbol_x = legend_x + 16 + (column * 135)
            text_x = symbol_x + 22
            entry_y = legend_y + 32 + (row * 17)
            parts.append(self._draw_legend_symbol(kind, symbol_x, entry_y - 3))
            parts.append(
                f'<text x="{text_x}" y="{entry_y}" font-size="9" font-family="Arial, sans-serif">'
                f"{xml_escape(label)}</text>"
            )

        parts.append("</svg>")
        svg = "\n".join(parts)

        output_file = Path(output_path).expanduser()
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(svg, encoding="utf-8")
        return svg

    def generate_json_spec(self, output_path: str) -> dict:
        spec = {
            "system_name": self.system.name,
            "line_designation": self._line_designation(),
            "process_fluid": self.system.process_fluid,
            "design_pressure_bar": self.system.pressure_bar,
            "design_temp_c": self.system.temp_c,
            "pipe_material": self.system.pipe_material,
            "pipe_schedule": self.system.pipe_schedule,
            "flow_rate_m3h": self.system.flow_rate_m3h,
            "instruments": self._tags(),
            "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        }

        output_file = Path(output_path).expanduser()
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(json.dumps(spec, indent=2), encoding="utf-8")
        return spec

    def run(self, output_dir: str) -> None:
        output_root = Path(output_dir).expanduser()
        output_root.mkdir(parents=True, exist_ok=True)
        slug = self.system.name.replace(" ", "_").lower()

        tags = self.generate_tag_list()
        self._print_tag_list(tags)

        svg_path = output_root / f"schematic_{slug}.svg"
        json_path = output_root / f"pid_spec_{slug}.json"

        self.generate_svg(str(svg_path))
        self.generate_json_spec(str(json_path))

        print(f"✓ SVG saved: {svg_path}")
        print(f"✓ JSON saved: {json_path}")
        print()


def main() -> None:
    output_dir = Path.home() / "jarvis_builds" / "pid_schematic_generator" / "output"

    demos = [
        (
            PipingSystem(
                name="Water Cooling Loop",
                process_fluid="Cooling Water",
                pressure_bar=6.0,
                temp_c=25.0,
                pipe_schedule="SCH-40",
                pipe_material="CS",
                flow_rate_m3h=45.0,
                has_pump=True,
                has_valve=True,
                has_heat_exchanger=True,
                has_flow_meter=True,
                has_pressure_relief=False,
                has_check_valve=True,
                has_temp_transmitter=True,
                has_pressure_transmitter=False,
            ),
            100,
        ),
        (
            PipingSystem(
                name="HP Steam Line",
                process_fluid="Steam",
                pressure_bar=42.0,
                temp_c=380.0,
                pipe_schedule="SCH-80",
                pipe_material="SS316",
                flow_rate_m3h=12.0,
                has_pump=False,
                has_valve=True,
                has_heat_exchanger=False,
                has_flow_meter=True,
                has_pressure_relief=True,
                has_check_valve=False,
                has_temp_transmitter=True,
                has_pressure_transmitter=True,
            ),
            200,
        ),
        (
            PipingSystem(
                name="Chemical Injection Skid",
                process_fluid="Methanol",
                pressure_bar=15.0,
                temp_c=20.0,
                pipe_schedule="SCH-80",
                pipe_material="SS316",
                flow_rate_m3h=2.5,
                has_pump=True,
                has_valve=False,
                has_heat_exchanger=False,
                has_flow_meter=True,
                has_pressure_relief=True,
                has_check_valve=True,
                has_temp_transmitter=False,
                has_pressure_transmitter=True,
            ),
            300,
        ),
    ]

    for system, loop_number in demos:
        PIDSchematic(system, loop_number=loop_number).run(str(output_dir))

    print("=== P&ID Generation Complete ===")
    for file_path in sorted(output_dir.glob("*")):
        if file_path.is_file():
            print(f"{file_path} ({file_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
