# Clean Architecture C# Snippets for Visual Studio Code

## Install

You can find this extension in the Visual Studio Code Marketplace.

## Index
  
* [Domain](#domain)
  * [Aggregate Root](#aggregate-root)
  * [Entity](#entity)
  * [Value Object](#value-object)
* [Application](#application)
  * [Use Case Boundary](#use-case-boundary)
  * [Use Case Implementation](#use-case-implementation)
* [Infrastructure](#infrastructure)
  * [Entity Implementation](#entity-implementation)
  * [Repository Implementation](#repository-implementation)
* [User Interface](#user-interface)
  * [Presenter](#presenter)

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
public sealed class ConcreteCustomer : Customer
{

}
```

### Repository Implementation

```cs
public sealed class ConcreteCustomer : Customer
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
    public DepositResponse(
        decimal amount,
        string description,
        DateTime transactionDate,
        decimal updatedBalance)
    {
        this.Amount = amount;
        this.Description = description;
        this.TransactionDate = transactionDate;
        this.UpdateBalance = updatedBalance;
    }

    /// <summary>
    ///     Gets amount Deposited.
    /// </summary>
    [Required]
    public decimal Amount { get; }

    /// <summary>
    ///     Gets description.
    /// </summary>
    [Required]
    public string Description { get; }

    /// <summary>
    ///     Gets transaction Date.
    /// </summary>
    [Required]
    public DateTime TransactionDate { get; }

    /// <summary>
    ///     Gets updated Balance.
    /// </summary>
    [Required]
    public decimal UpdateBalance { get; }
}
```
