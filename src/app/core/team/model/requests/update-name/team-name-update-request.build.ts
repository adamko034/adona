import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';

export class TeamNameUpdateRequestBuilder {
  private request: TeamNameUpdateRequest;

  private constructor(id: string, name: string) {
    this.request = { id, name };
  }

  public static from(id: string, name: string): TeamNameUpdateRequestBuilder {
    return new TeamNameUpdateRequestBuilder(id, name);
  }

  public build(): TeamNameUpdateRequest {
    return this.request;
  }
}
