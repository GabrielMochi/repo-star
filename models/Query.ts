import Edge from './Edge'

export default class Query<T> {
  public edges: Edge<T>[]

  constructor (edges: Edge<T>[] = []) {
    this.edges = edges
  }
}
