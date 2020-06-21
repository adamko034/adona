import { SettingsToolbar } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar.model';

export class SettingsToolbarBuilder {
  private data: SettingsToolbar;

  private constructor(title: string, backButtonUrl: string) {
    this.data = { title, backButtonUrl };
  }

  public static from(title: string, backButtonUrl: string): SettingsToolbarBuilder {
    return new SettingsToolbarBuilder(title, backButtonUrl);
  }

  public withSubtitle(subtitle: string): SettingsToolbarBuilder {
    this.data.subtitle = subtitle;
    return this;
  }

  public build(): SettingsToolbar {
    return this.data;
  }
}
