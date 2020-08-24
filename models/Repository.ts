import LicenseInfo from './LicenseInfo'
import Owner from './Owner'
import Language from './Language'
import Stargazers from './Stargazers'

export default class Repository {
  public description: string
  public licenseInfo: LicenseInfo
  public name: string
  public owner: Owner
  public primaryLanguage: Language
  public updatedAt: Date
  public url: string
  public stargazers: Stargazers

  constructor (
    description: string, licenseInfo: LicenseInfo,
    name: string, owner: Owner, primaryLanguage: Language,
    updatedAt: Date, url: string, stargazers: Stargazers
  ) {
    this.description = description
    this.licenseInfo = licenseInfo
    this.name = name
    this.owner = owner
    this.primaryLanguage = primaryLanguage
    this.updatedAt = updatedAt
    this.url = url
    this.stargazers = stargazers
  }
}
