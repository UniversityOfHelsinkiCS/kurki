package service;

public interface ComparableOption extends Comparable, Option {

    @Override
    public int compareTo( Object another );

    @Override
    public boolean equals(Object another);

    public Comparable getComparableId();

    public String getDesc();

    @Override
    public String getLabel();

    @Override
    public String getValue();
}
