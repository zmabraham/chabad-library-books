"""
CLI for the Undaunted build pipeline.
"""

import click
from pathlib import Path

from .load import load_registry
from .validate import validate_registry_dir, ValidationReport


@click.group()
@click.version_option(version="0.1.0")
def main():
    """Undaunted Knowledge System - Build pipeline."""
    pass


@main.command()
@click.argument(
    "registry_dir", type=click.Path(exists=True, path_type=Path), default="registry"
)
def validate(registry_dir: Path):
    """Validate the registry for errors."""
    click.echo(f"Validating registry at: {registry_dir}")

    report = validate_registry_dir(registry_dir)
    report.print_report()

    # Exit with error code if validation failed
    if report.failed():
        raise click.ClickException("Validation failed")


@main.command()
@click.argument(
    "registry_dir", type=click.Path(exists=True, path_type=Path), default="registry"
)
@click.option("--output", "-o", type=click.Path(path_type=Path), default="site/public/data")
def build(registry_dir: Path, output: Path):
    """Build the site from the registry."""
    click.echo(f"Loading registry from: {registry_dir}")

    # First validate
    report = validate_registry_dir(registry_dir)
    if report.failed():
        click.echo("❌ Validation failed - build aborted")
        report.print_report()
        raise click.ClickException("Cannot build with invalid registry")

    click.echo("✓ Validation passed")

    # Load registry
    registry = load_registry(registry_dir)
    click.echo(f"✓ Loaded {len(registry.all_entities())} entities")

    # Create output directory
    output.mkdir(parents=True, exist_ok=True)

    # TODO: Write JSON files
    # For now, just report what we'd build
    click.echo(f"✓ Would build to: {output}")
    click.echo(f"  - manifest.json")
    click.echo(f"  - entities.json ({len(registry.all_entities())} entities)")
    click.echo(f"  - relationships.json ({len(registry.relationships)} relationships)")
    click.echo(f"  - chapters.json ({len(registry.chapters)} chapters)")
    click.echo(f"  - wiki/ ({len(registry.wiki)} entries)")


if __name__ == "__main__":
    main()
