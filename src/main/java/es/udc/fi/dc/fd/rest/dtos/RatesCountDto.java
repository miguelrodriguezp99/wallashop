package es.udc.fi.dc.fd.rest.dtos;

public class RatesCountDto {
    private long trueRatesCount;
    private long falseRatesCount;

    public RatesCountDto(long trueRatesCount, long falseRatesCount) {
        this.trueRatesCount = trueRatesCount;
        this.falseRatesCount = falseRatesCount;
    }

    public long getTrueRatesCount() {
        return trueRatesCount;
    }

    public long getFalseRatesCount() {
        return falseRatesCount;
    }
}
