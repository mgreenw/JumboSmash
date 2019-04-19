# Stress Testings


## Test data

- `test_data/`

## Clients

- `jmeter/`
- `python/`

## Results
- `result/`

## Jmeter Result Jargon

**Label**: It is the name/URL for the specific HTTP(s) Request. If you have selected “Include group name in label?” option then the name of the Thread Group is applied as the prefix to each label.

**Samples**: This indicates the number of virtual users per request.

**Average**: It is the average time taken by all the samples to execute specific label. In our case, average time for Label 1 is 986 milliseconds & total average time is 667 milliseconds.

**Min**: The shortest time taken by a sample for specific label. If we look at Min value for Label 1 then, out of 20 samples shortest response time one of the sample had was 584 milliseconds.

**Max**: The longest time taken by a sample for specific label. If we look at Max value for Label 1 then, out of 20 samples longest response time one of the sample had was 2867 milliseconds.

**Std. Dev.**: This shows the set of exceptional cases which were deviating from the average value of sample response time. The lesser this value more consistent the data. Standard deviation should be less than or equal to half of the average time for a label.

**Error%**: Percentage of Failed requests per Label.

**Throughput**: Throughput is the number of request that are processed per time unit(seconds, minutes, hours) by the server. This time is calculated from the start of first sample to the end of the last sample. Larger throughput is better.

**KB/Sec**: This indicates the amount of data downloaded from server during the performance test execution. In short, it is the Throughput measured in Kilobytes per second.

**90% Line**: 90% of the samples took no more than this time. The remaining samples took at least as long as this. (90th percentile)

**95% Line**: 95% of the samples took no more than this time. The remaining samples took at least as long as this. (95th percentile)

**99% Line**: 99% of the samples took no more than this time. The remaining samples took at least as long as this. (99th percentile)

**Median**: It is the time in the middle of a set of samples result. It indicates that 50% of the samples took no more than this time i.e the remainder took at least as long.
