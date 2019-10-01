package service;

import kurki.servicehandlers.AbstractVelocityServiceProvider;

public interface Service extends ComparableOption {
    static final int UNDEFINED_ROLE = Integer.MIN_VALUE;

    String getId();
    int getLowestRole();
    boolean isValidServiceFor( int userInRole );
    AbstractVelocityServiceProvider getHandler();
}
