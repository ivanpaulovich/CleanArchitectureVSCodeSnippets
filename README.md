# Clean Architecture C# Snippets for Visual Studio Code

C# Snippets to guide you into implementing a software following the Clean Architecture principles. It helps with the project structure, design patterns, dependencies and to use frameworks on the correct way.

## Install

You can install [Clean Architecture C# Snippets](https://marketplace.visualstudio.com/items?itemName=ivanpaulovich.clean-architecture-csharp-snippets) from the Visual Studio Code Marketplace.

## Index of Code Snippets
  
* [Domain](#domain)
  * [Aggregate Root](#aggregate-root)
  * [Entity](#entity)
  * [Value Object](#value-object)
  * [Domain Service](#domain-service)
  * [Factory](#factory)
* [Application](#application)
  * [Use Case Boundary](#use-case-boundary)
  * [Use Case Implementation](#use-case-implementation)
  * [Unit of Work](#unit-of-work)
* [Infrastructure](#infrastructure)
  * [Entity Implementation](#entity-implementation)
  * [Repository Implementation](#repository-implementation)
  * [Unit of Work Implementation](#unit-of-work-implementation)
  * [Factory Implementation](#factory-implementation)
  * [Unit Of Work Implementation](#entity-context)
  * [DB Context](#db-context)
* [User Interface](#user-interface)
  * [Presenter](#presenter)
* [Roadmap](#roadmap)

## Domain

### Aggregate Root

```cs
public interface ICustomer
{

}

public abstract class Customer : ICustomer
{

}

public interface ICustomerRepository
{

}
```

### Entity

```cs
public interface ICustomer
{

}

public abstract class Customer : ICustomer
{

}
```

### Value Object

```cs
public readonly struct Name
{
    private readonly string _text;

    public Name(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new NameShouldNotBeEmptyException("The 'Name' field is required");

        _text = text;
    }

    public override string ToString()
    {
        return _text;
    }
}
```

### Domain Service

```cs
public sealed class AccountService
{
    private readonly IAccountFactory _accountFactory;
    private readonly IAccountRepository _accountRepository;

    public AccountService(
        IAccountFactory accountFactory,
        IAccountRepository accountRepository)
    {
        this._accountFactory = accountFactory;
        this._accountRepository = accountRepository;
    }
}
```

### Factory

```cs
public interface IAccountFactory
{
}
```

## Application

### Use Case Boundary

```cs
public interface IDepositUseCase : IUseCase<DepositInput>
{

}

public interface IDepositOutputPort : IOutputPortStandard<DepositOutput>, IOutputPortNotFound, IOutputPortError
{

}

public sealed class DepositInput
{

}

public sealed class DepositOutput
{

}
```

### Use Case Implementation

```cs
public sealed class DepositUseCase : IDepositUseCase
{
    private readonly IDepositOutputPort _depositOutputPort;
    private readonly IUnitOfWork _unitOfWork;

    public DepositUseCase(
        IDepositOutputPort depositOutputPort,
        IUnitOfWork unitOfWork)
    {
        this._depositOutputPort = depositOutputPort;
        this._unitOfWork = unitOfWork;
    }

    public async Task Execute(DepositInput input)
    {
        throw new NotImplementedException();
    }
}
```

## Infrastructure

### Entity Implementation

```cs
public sealed class CustomerImpl : Customer
{

}
```

### Repository Implementation

```cs
public sealed class CustomerRepository : ICustomerRepository
{

}
```

## User Interface

### Presenter

```cs
public sealed class DepositPresenter : IDepositOutputPort
{
    public IActionResult ViewModel { get; private set; } = new NoContentResult();

    public void NotFound(string message) => this.ViewModel = new NotFoundObjectResult(message);

    public void Standard(DepositOutput depositOutput)
    {

    }

    public void WriteError(string message) => this.ViewModel = new BadRequestObjectResult(message);
}
```

### Response

```cs
public sealed class DepositResponse
{

}
```

## Roadmap

* [ ] Code snippets.
* [ ] Context menu.
* [ ] Code analyzers.
* [ ] Infrastructure.

> Features are released quickly. Check out the [Changelog](https://github.com/ivanpaulovich/CleanArchitectureVSCodeSnippets/blob/master/CHANGELOG.md) and give a :star:!