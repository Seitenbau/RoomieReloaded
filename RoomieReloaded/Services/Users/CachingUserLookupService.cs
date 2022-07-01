using System;
using System.Threading.Tasks;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Caching.Memory;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Users;

public class CachingUserLookupService : ICachingUserLookupService
{
    private readonly TimeSpan _cacheTime = TimeSpan.FromDays(1);

    private readonly IUserLookupService _userLookupService;
    private readonly IMemoryCache _userCache;

    public CachingUserLookupService(IUserLookupService userLookupService, IMemoryCache userCache)
    {
        _userLookupService = userLookupService;
        _userCache = userCache;
    }

    public async Task<IUser> GetUserAsync(Organizer organizer)
    {
        var cacheKey = GetCacheKey(organizer);
        if (_userCache.TryGetValue<IUser>(cacheKey, out var user))
        {
            return user;
        }

        var lookupResult = await _userLookupService.GetUserAsync(organizer);

        return _userCache.Set(cacheKey, lookupResult, _cacheTime);
    }

    private string GetCacheKey(Organizer organizer)
    {
        return organizer.Value.UserInfo;
    }
}