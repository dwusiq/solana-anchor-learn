# Testing

* `contract`

```
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract TestContract {
    uint256 public savedDate;

    function updateDate(uint256 _new_date) external {
        savedDate = _new_date;
    }
}
```