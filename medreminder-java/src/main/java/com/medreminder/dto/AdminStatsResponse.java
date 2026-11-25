package com.medreminder.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long activeMeds;
    private int alertsToday;
    private String systemStatus;

    public AdminStatsResponse(long totalUsers, long activeMeds, int alertsToday, String systemStatus) {
        this.totalUsers = totalUsers;
        this.activeMeds = activeMeds;
        this.alertsToday = alertsToday;
        this.systemStatus = systemStatus;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getActiveMeds() { return activeMeds; }
    public int getAlertsToday() { return alertsToday; }
    public String getSystemStatus() { return systemStatus; }
}

