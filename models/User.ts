import Repository from './Repository'
import Query from './Query'

export default class {
  public login: string;
  public name: string;
  public bio: string;
  public location: string;
  public avatarUrl: string;
  public url: string;
  public email: string;
  public starredRepositories?: Repository[] | Query<Repository>;

  constructor (
    login: string, name: string, bio: string,
    location: string, avatarUrl: string,
    url: string, email: string,
    starredRepositories?: Repository[] | Query<Repository>
  ) {
    this.login = login
    this.name = name
    this.bio = bio
    this.location = location
    this.avatarUrl = avatarUrl
    this.url = url
    this.email = email
    this.starredRepositories = starredRepositories
  }
}
