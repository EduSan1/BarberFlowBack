export class ListClientesUseCase {
  constructor(repository) { this.repository = repository }
  execute() { return this.repository.findAll() }
}
