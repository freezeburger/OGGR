(function() {
    var DefaultMomentLocale, scope;

    DefaultMomentLocale = {
        locale_name: 'en',
        locale: {
            'month': {
                'name': [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                'gen': [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                'abbr': [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'abbr2': [null, 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
            },
            'day': {
                'name': [null, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'abbr': [null, 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                'part': {
                    'night': 'night',
                    'morning': 'morning',
                    'day': 'day',
                    'evening': 'evening'
                }
            }
        }
    };

    scope = typeof window === 'object' ? window : global;

    scope.DefaultMomentLocale = DefaultMomentLocale;

}).call(this);

(function() {
    var Moment, scope,
        _this = this;

    Date.prototype.to_m = function() {
        return new Moment(_this);
    };

    Object._size = function(obj) {
        var key, size;
        size = 0;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    Moment = (function() {

        Moment.o_mori = "Respice post te! Hominem te memento! (Look behind you! Remember that you are but a man!)";

        Moment.to_leading_zero = function(int, sign) {
            var num, t, _sign;
            if (sign == null) {
                sign = false;
            }
            num = Math.abs(int);
            _sign = int < 0 ? '-' : '';
            _sign = sign ? _sign : '';
            t = Math.abs(int) < 10 ? "" + _sign + "0" + num : "" + _sign + num;
            return t;
        };

        Moment.prototype.locales = {};

        Moment.prototype.locale_name = null;

        Moment.prototype.current_locale = null;

        Moment["new"] = function(data) {
            return new Moment(data);
        };

        Moment.add_locale = function(name, locale) {
            Moment.prototype.locales[name] = locale;
            return Moment.prototype.locale_name = name;
        };

        Moment.set_default_locale = function(name) {
            Moment.prototype.locale_name = name;
            return Moment.prototype.current_locale = Moment.prototype.locales[name];
        };

        Moment.want = function(M) {
            M = M instanceof Moment ? M : new Moment(M);
            return M;
        };

        Moment.prototype.set_locale = function(name) {
            this.locale_name = name;
            this.current_locale = this.locales[name];
            return this.t = this.current_locale;
        };

        function Moment(date) {
            var l, n, _ref;
            this.scope = typeof window === 'object' ? window : global;
            if (Object._size(this.locales) === 0) {
                _ref = [DefaultMomentLocale.locale_name, DefaultMomentLocale.locale], n = _ref[0], l = _ref[1];
                Moment.add_locale(n, l);
                Moment.set_default_locale(n);
            }
            this.t = this.current_locale;
            this.parse(date);
        }

        Moment.prototype.day_name = function() {
            return this.t.day.name[this.day_of_week()];
        };

        Moment.prototype.month_name = function() {
            return this.t.month.name[this.month];
        };

        Moment.prototype.to_i = function() {
            return this.unix;
        };

        Moment.prototype.to_a = function() {
            return [this.year, this.month, this.day, this.hours, this.mins, this.secs, this.ms, this.shift];
        };

        Moment.prototype.to_hash = function() {
            return {
                year: this.year,
                month: this.month,
                day: this.day,
                hours: this.hours,
                mins: this.mins,
                secs: this.secs,
                ms: this.ms,
                shift: this.shift
            };
        };

        Moment.prototype.toMonthString = function() {
            return "" + this.year + "." + this.month;
        };

        Moment.prototype.toDayString = function() {
            return "" + this.year + "." + this.month + "." + this.day;
        };

        Moment.prototype.set = function(d) {
            return this.parse(d);
        };

        Moment.prototype.set_year = function(y) {
            var d;
            d = this.date;
            d.setYear(y);
            return this.parse(d);
        };

        Moment.prototype.set_month = function(m) {
            var d;
            d = this.date;
            d.setMonth(m - 1);
            return this.parse(d);
        };

        Moment.prototype.set_day = function(_d) {
            var d;
            d = this.date;
            d.setDate(_d);
            return this.parse(d);
        };

        Moment.prototype.set_hours = function(h) {
            var d;
            d = this.date;
            d.setHours(h);
            return this.parse(d);
        };

        Moment.prototype.set_mins = function(m) {
            var d;
            d = this.date;
            d.setMinutes(m);
            return this.parse(d);
        };

        Moment.prototype.set_secs = function(s) {
            var d;
            d = this.date;
            d.setSeconds(s);
            return this.parse(d);
        };

        Moment.prototype.set_ms = function(ms) {
            var d;
            d = this.date;
            d.setMilliseconds(ms);
            return this.parse(d);
        };

        Moment.prototype.set_unix = function(sec) {
            return this.parse(sec);
        };

        Moment.prototype.set_unix_ms = function(ms) {
            return this.date_parse(new Date(ms));
        };

        Moment.prototype.set_date_by_instances = function() {
            var date, month;
            date = new Date(0);
            month = this.month > 0 ? this.month - 1 : this.month;
            date.setFullYear(this.year);
            date.setMonth(month);
            date.setDate(this.day);
            date.setHours(this.hours);
            date.setMinutes(this.mins);
            date.setSeconds(this.secs);
            date.setMilliseconds(this.ms);
            return this.date = date;
        };

        Moment.prototype._year = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getFullYear();
        };

        Moment.prototype._month = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getMonth() + 1;
        };

        Moment.prototype._day = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getDate();
        };

        Moment.prototype._hours = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getHours();
        };

        Moment.prototype._mins = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getMinutes();
        };

        Moment.prototype._secs = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getSeconds();
        };

        Moment.prototype._ms = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getMilliseconds();
        };

        Moment.prototype._shift = function(date) {
            if (date == null) {
                date = new Date;
            }
            return -(date.getTimezoneOffset() / 60);
        };

        Moment.prototype._unix_ms = function(date) {
            if (date == null) {
                date = new Date;
            }
            return date.getTime();
        };

        Moment.prototype.parse = function(date) {
            var empty;
            if (!date) {
                this.date_parse();
            }
            if (typeof date === 'string') {
                empty = date === '';
                if (empty) {
                    this.date_parse();
                }
                if (!empty) {
                    this.string_parse(date);
                }
            }
            if (typeof date === 'number') {
                this.number_parse(date * 1000);
            }
            if (typeof date === 'object') {
                if (date instanceof Date) {
                    return this.date_parse(date);
                }
                if (date instanceof Array) {
                    return this.array_parse(date);
                }
                if (date instanceof Object) {
                    return this.hash_parse(date);
                }
                if (date instanceof Moment) {
                    return new Moment(date.to_a());
                }
            }
            return this;
        };

        Moment.prototype.date_parse = function(date) {
            if (date == null) {
                date = new Date;
            }
            this.date = date;
            this.year = this._year(this.date);
            this.month = this._month(this.date);
            this.day = this._day(this.date);
            this.hours = this._hours(this.date);
            this.mins = this._mins(this.date);
            this.secs = this._secs(this.date);
            this.ms = this._ms(this.date);
            this.shift = this._shift(this.date);
            this.unix_ms = this._unix_ms(this.date);
            this.unix = Math.round(this.unix_ms / 1000);
            return this;
        };

        Moment.prototype.array_parse = function(date) {
            var _date;
            if (date.length === 0) {
                return this.date_parse();
            }
            _date = new Date(0);
            this.year = date[0] ? date[0] : this._year(_date);
            this.month = date[1] ? date[1] : 1;
            this.day = date[2] ? date[2] : 1;
            this.hours = date[3] ? date[3] : 0;
            this.mins = date[4] ? date[4] : 0;
            this.secs = date[5] ? date[5] : 0;
            this.ms = date[6] ? date[6] : 0;
            this.shift = date[7] ? date[7] : this._shift(_date);
            this.set_date_by_instances();
            return this.date_parse(this.date);
        };

        Moment.prototype.hash_parse = function(date) {
            var empty_hash, _date;
            empty_hash = !date['year'] && !date['month'] && !date['day'] && !date['hours'] && !date['mins'] && !date['secs'] && !date['ms'];
            if (empty_hash) {
                return this.date_parse();
            }
            _date = new Date(0);
            this.year = date['year'] ? date['year'] : this._year(_date);
            this.month = date['month'] ? date['month'] : 1;
            this.day = date['day'] ? date['day'] : 1;
            this.hours = date['hours'] ? date['hours'] : 0;
            this.mins = date['mins'] ? date['mins'] : 0;
            this.secs = date['secs'] ? date['secs'] : 0;
            this.ms = date['ms'] ? date['ms'] : 0;
            this.shift = date['shift'] ? date['shift'] : this._shift(_date);
            this.set_date_by_instances();
            return this.date_parse(this.date);
        };

        Moment.prototype.string_parse = function(date) {
            var _date;
            if (date.match('-') && date.match(':') && !date.match('T')) {
                date = date.replace(/-/g, '/');
            }
            if (date.match('\\.') && !date.match(':')) {
                return this.array_parse(date.split('.'));
            }
            _date = new Date(Date.parse(date));
            return this.date_parse(_date);
        };

        Moment.prototype.number_parse = function(date) {
            var _date;
            _date = new Date(date);
            return this.date_parse(_date);
        };

        return Moment;

    })();

    scope = typeof window === 'object' ? window : global;

    scope.Moment = Moment;

    scope.to_lz = Moment.to_leading_zero;

    Moment.add_locale(DefaultMomentLocale.locale_name, DefaultMomentLocale.locale);

    Moment.set_default_locale('en');

}).call(this);

(function() {

    Moment.prototype.max_days = 42;

    Moment.prototype.shift_months = function(n) {
        var shift;
        shift = this.month + n;
        shift = shift <= 0 ? shift - 1 : shift;
        return new Moment([this.year, shift]);
    };

    Moment.today = function(M2) {
        var M1;
        M1 = new Moment;
        return M1.today(M2);
    };

    Moment.prototype.today = function(M2) {
        var M1;
        M1 = this;
        M2 = Moment.want(M2);
        return M1.year === M2.year && M1.month === M2.month && M1.day === M2.day;
    };

    Moment.prototype.month_length = function(year, month) {
        if (year == null) {
            year = this.year;
        }
        if (month == null) {
            month = this.month;
        }
        return new Date(year, month, 0).getDate();
    };

    Moment.prototype.prev_month_length = function() {
        return new Date(this.year, this.month - 1, 0).getDate();
    };

    Moment.prototype.next_month_length = function() {
        return new Date(this.year, this.month + 1, 0).getDate();
    };

    Moment.prototype.day_of_week = function(date) {
        var day;
        if (date == null) {
            date = this.date;
        }
        day = date.getDay();
        day = day === 0 ? 7 : day;
        return day;
    };

    Moment.prototype.first_day_of_month = function() {
        var day;
        day = new Date(this.year, this.month - 1, 1).getDay();
        day = day === 0 ? 7 : day;
        return day;
    };

    Moment.prototype.last_day_of_month = function() {
        var day, length;
        length = this.month_length(this.year, this.month);
        day = new Date(this.year, this.month - 1, length).getDay();
        day = day === 0 ? 7 : day;
        return day;
    };

    Moment.prototype.days_before_month = function() {
        return this.first_day_of_month() - 1;
    };

    Moment.prototype.days_after_month = function() {
        return this.max_days - (this.days_before_month() + this.month_length());
    };

}).call(this);

(function() {

    Moment.prototype.part_of_day = function() {
        var part;
        return part = this.is_night() ? this.t.day.part.night : this.is_morning() ? this.t.day.part.morning : this.is_day() ? this.t.day.part.day : this.t.day.part.evening;
    };

    Moment.prototype.is_night = function() {
        return this.hours < 6;
    };

    Moment.prototype.is_morning = function() {
        return this.hours >= 6 && this.hours < 12;
    };

    Moment.prototype.is_day = function() {
        return this.hours >= 12 && this.hours < 18;
    };

    Moment.prototype.is_evening = function() {
        return this.hours >= 18;
    };

    Moment.prototype.is_weekend = function() {
        var day;
        day = this.day_of_week();
        return day === 6 || day === 7;
    };

    Moment.prototype.is_monday = function() {
        return this.day_of_week() === 1;
    };

    Moment.prototype.is_tuesday = function() {
        return this.day_of_week() === 2;
    };

    Moment.prototype.is_wednesday = function() {
        return this.day_of_week() === 3;
    };

    Moment.prototype.is_thursday = function() {
        return this.day_of_week() === 4;
    };

    Moment.prototype.is_friday = function() {
        return this.day_of_week() === 5;
    };

    Moment.prototype.is_saturday = function() {
        return this.day_of_week() === 6;
    };

    Moment.prototype.is_sunday = function() {
        return this.day_of_week() === 7;
    };

    Moment.prototype.is_mon = function() {
        return this.is_monday();
    };

    Moment.prototype.is_tue = function() {
        return this.is_tuesday();
    };

    Moment.prototype.is_wed = function() {
        return this.is_wednesday();
    };

    Moment.prototype.is_thu = function() {
        return this.is_thursday();
    };

    Moment.prototype.is_fri = function() {
        return this.is_friday();
    };

    Moment.prototype.is_sat = function() {
        return this.is_saturday();
    };

    Moment.prototype.is_sun = function() {
        return this.is_sunday();
    };

}).call(this);

(function() {

    Moment.prototype.less = function(M) {
        if (M == null) {
            M = new Date;
        }
        M = Moment.want(M);
        return this.unix_ms < M.unix_ms;
    };

    Moment.prototype.less_or_equal = function(M) {
        if (M == null) {
            M = new Date;
        }
        M = Moment.want(M);
        return this.unix_ms <= M.unix_ms;
    };

    Moment.prototype.equal = function(M) {
        if (M == null) {
            M = new Date;
        }
        M = Moment.want(M);
        return this.unix_ms === M.unix_ms;
    };

    Moment.prototype.greater_or_equal = function(M) {
        if (M == null) {
            M = new Date;
        }
        M = Moment.want(M);
        return this.unix_ms >= M.unix_ms;
    };

    Moment.prototype.greater = function(M) {
        if (M == null) {
            M = new Date;
        }
        M = Moment.want(M);
        return this.unix_ms > M.unix_ms;
    };

    Moment.prototype.l = function(M) {
        return this.less(M);
    };

    Moment.prototype.loe = function(M) {
        return this.less_or_equal(M);
    };

    Moment.prototype.e = function(M) {
        return this.equal(M);
    };

    Moment.prototype.goe = function(M) {
        return this.greater_or_equal(M);
    };

    Moment.prototype.g = function(M) {
        return this.greater(M);
    };

}).call(this);

(function() {
    var DayBehavior;

    this.log = function(args) {
        return console.log(args);
    };

    this.compactArray = function(array) {
        return array.filter(function(e) {
            return e;
        });
    };

    this.OrderedHash = (function() {

        function OrderedHash(array) {
            if (array == null) {
                array = [];
            }
            this.data = [];
            if (array.length > 0) {
                this.data = array;
            }
        }

        OrderedHash.prototype.get = function() {
            return this.data;
        };

        OrderedHash.prototype.push = function(obj) {
            return this.data.push(obj);
        };

        OrderedHash.prototype.deleteByKey = function(key) {
            var index, item, name, value, _ref;
            _ref = this.data;
            for (index in _ref) {
                item = _ref[index];
                for (name in item) {
                    value = item[name];
                    if (name.toString() === key.toString()) {
                        delete this.data[index];
                    }
                }
            }
            return this.data = compactArray(this.data);
        };

        OrderedHash.prototype.sortByKey = function(reverse) {
            if (reverse == null) {
                reverse = false;
            }
            return this.data.sort(function(a, b) {
                var akey, anum, bkey, bnum, key, r, value, _ref;
                for (key in a) {
                    value = a[key];
                    akey = key;
                }
                for (key in b) {
                    value = b[key];
                    bkey = key;
                }
                anum = parseInt(akey, 10);
                bnum = parseInt(bkey, 10);
                if (typeof anum === 'number' && typeof bnum === 'number') {
                    akey = anum;
                    bkey = bnum;
                }
                if (reverse) {
                    _ref = [bkey, akey], akey = _ref[0], bkey = _ref[1];
                }
                return r = akey > bkey ? 1 : akey < bkey ? -1 : 0;
            });
        };

        OrderedHash.prototype.sortByValue = function(reverse) {
            if (reverse == null) {
                reverse = false;
            }
            return this.data.sort(function(a, b) {
                var avalue, bvalue, key, r, value, _ref;
                for (key in a) {
                    value = a[key];
                    avalue = value.toString().toLowerCase();
                }
                for (key in b) {
                    value = b[key];
                    bvalue = value.toString().toLowerCase();
                }
                if (reverse) {
                    _ref = [bvalue, avalue], avalue = _ref[0], bvalue = _ref[1];
                }
                return r = avalue > bvalue ? 1 : avalue < bvalue ? -1 : 0;
            });
        };

        return OrderedHash;

    })();

    this.buildTimeList = function(ordered_hash) {
        var M, hash, index, item, key, list, value;
        list = '';
        ordered_hash.sortByKey();
        hash = ordered_hash.get();
        for (index in hash) {
            item = hash[index];
            for (key in item) {
                value = item[key];
                M = new Moment($(value).data('date'));
                list += "<li>" + M.year + " " + (M.month_name()) + " " + M.day + " </li>";
            }
        }
        return $('.time_list ul').html(list);
    };

    this.CalendarItems = (function() {

        function CalendarItems(calendar) {
            this.calendar = calendar;
            this.id = this.calendar.id;
            this.block = this.calendar.block;
            this.current_month = null;
        }

        return CalendarItems;

    })();

    this.CalendarItems = (function() {

        function CalendarItems(calendar) {
            this.calendar = calendar;
            this.id = this.calendar.id;
            this.block = this.calendar.block;
            this.current_month = null;
        }

        CalendarItems.prototype.first_month = function() {
            return $("" + this.id + " .months .month").first();
        };

        CalendarItems.prototype.month_width = function() {
            return this._mwidth = this._mwidth ? this._mwidth : this.first_month().outerWidth(true);
        };

        CalendarItems.prototype.viewport = function() {
            return this._viewport = this._viewport ? this._viewport : $("" + this.id + " .months .viewport");
        };

        CalendarItems.prototype.months = function() {
            return this._month = this._month ? this._month : $("" + this.id + " .months");
        };

        CalendarItems.prototype.left = function() {
            return this._left = this._left ? this._left : $("" + this.id + " .nav i");
        };

        CalendarItems.prototype.right = function() {
            return this._right = this._right ? this._right : $("" + this.id + " .nav b");
        };

        CalendarItems.prototype.days = function() {
            return $("" + this.id + " .months .month a");
        };

        return CalendarItems;

    })();

    this.CalendarView = (function() {

        function CalendarView(calendar) {
            this.calendar = calendar;
            this.id = this.calendar.id;
        }

        CalendarView.prototype.template = function(body) {
            if (body == null) {
                body = '';
            }
            return "<div class='calendar'>\n  <div class='nav'>\n    <i title='prev month' /><b title='next month' />\n  </div>\n  <div class='viewport'>\n    <div class='months'>\n      " + body + "\n    </div>\n  </div>\n</div>";
        };

        CalendarView.prototype.days_names = function() {
            var html, i, name, _i;
            html = '';
            for (i = _i = 1; _i <= 7; i = ++_i) {
                name = this.calendar.options.locale.day.abbr[i];
                html += "<i>" + name + "</i>";
            }
            return html;
        };

        CalendarView.prototype.days = function(M) {
            var current_day, days, empty_after, empty_before, i, month_length, mstart, n, prev_length, stamp, today, weekend, _i, _j, _k, _ref;
            days = '';
            today = new Moment;
            empty_before = M.days_before_month();
            prev_length = M.prev_month_length();
            mstart = prev_length - empty_before;
            if (empty_before > 0) {
                for (i = _i = 0, _ref = empty_before - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                    n = mstart + i;
                    days += "<b>" + n + "</b>";
                }
            }
            month_length = M.month_length();
            for (i = _j = 1; 1 <= month_length ? _j <= month_length : _j >= month_length; i = 1 <= month_length ? ++_j : --_j) {
                current_day = new Moment([M.year, M.month, i]);
                weekend = current_day.is_weekend() ? " class='weekend' " : '';
                stamp = "data-date='" + (current_day.toDayString()) + "'";
                if (current_day.today()) {
                    days += "<a href='#' class='today' " + stamp + ">" + i + "</a>";
                } else if (current_day.less(today)) {
                    days += "<i " + stamp + ">" + i + "</i>";
                } else {
                    days += "<a href='#' " + weekend + " " + stamp + ">" + i + "</a>";
                }
            }
            empty_after = M.days_after_month();
            for (i = _k = 1; 1 <= empty_after ? _k <= empty_after : _k >= empty_after; i = 1 <= empty_after ? ++_k : --_k) {
                days += "<s>" + i + "</s>";
            }
            return days;
        };

        CalendarView.prototype.month = function(M) {
            return "<div class='month' data-date='" + (M.toMonthString()) + "'>\n  <div class='header'>\n    " + (M.month_name()) + "\n    " + M.year + "\n  </div>\n  <div class='body'>\n    <div class='day_names'>" + (this.days_names()) + "</div>\n    <div class='days'>" + (this.days(M)) + "</div>\n  </div>\n</div>";
        };

        return CalendarView;

    })();

    this.Calendar = (function() {

        function Calendar(id, opts) {
            var M, i, month, _i, _ref;
            this.id = id != null ? id : '#calendar';
            if (opts == null) {
                opts = {};
            }
            this.options = {
                mcount: 2,
                date: Moment["new"](),
                locale: DefaultMomentLocale.locale
            };
            $.extend(this.options, opts);
            this.block = $(this.id);
            this.init_moment = new Moment;
            this.items = new CalendarItems(this);
            this.view = new CalendarView(this);
            this.block.append(this.view.template());
            M = Moment["new"](this.options.date);
            for (i = _i = 0, _ref = this.options.mcount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                month = M.shift_months(i);
                this.items.months().append(this.view.month(month));
            }
            this.items.current_month = this.items.first_month();
        }

        return Calendar;

    })();

    this.CalendarBehavior = (function() {

        function CalendarBehavior(calendar) {
            var month_width,
                _this = this;
            this.calendar = calendar;
            this.items = this.calendar.items;
            this.view = this.calendar.view;
            this.animation_in_progress = false;
            this.animation_speed = 400;
            month_width = this.items.month_width();
            this.items.left().click(function() {
                var M, prev_month;
                if (_this.animation_in_progress) {
                    return false;
                }
                prev_month = _this.items.current_month.prev().length > 0;
                if (!prev_month) {
                    M = new Moment(_this.items.current_month.attr('data-date'));
                    M = M.shift_months(-1);
                    _this.items.months().prepend(_this.view.month(M));
                    _this.items.months().css({
                        left: -month_width
                    });
                }
                _this.animation_in_progress = true;
                _this.items.months().animate({
                    left: "+=" + month_width
                }, _this.animation_speed, function() {
                    return _this.animation_in_progress = false;
                });
                return _this.items.current_month = _this.items.current_month.prev();
            });
            this.items.right().click(function() {
                var M, next_month;
                if (_this.animation_in_progress) {
                    return false;
                }
                next_month = _this.items.current_month.next().length > 0;
                if (!next_month) {
                    M = new Moment(_this.items.current_month.attr('data-date'));
                    M = M.shift_months(1);
                    _this.items.months().append(_this.view.month(M));
                }
                _this.animation_in_progress = true;
                _this.items.months().animate({
                    left: "-=" + month_width
                }, _this.animation_speed, function() {
                    return _this.animation_in_progress = false;
                });
                return _this.items.current_month = _this.items.current_month.next();
            });
        }

        return CalendarBehavior;

    })();

    DayBehavior = (function() {

        function DayBehavior(calendar) {
            var _this = this;
            this.calendar = calendar;
            this.items = this.calendar.items;
            this.view = this.calendar.view;
            this.hash = new OrderedHash;
            this.items.days().live('click', function(event) {
                var M, day, obj;
                day = $(event.target);
                M = new Moment(day.data('date'));
                if (!day.hasClass('selected')) {
                    obj = {};
                    obj[M.unix] = day[0];
                    _this.hash.push(obj);
                } else {
                    _this.hash.deleteByKey(M.unix);
                }
                day.toggleClass('selected');
                buildTimeList(_this.hash);
                return false;
            });
        }

        return DayBehavior;

    })();

    $(function() {
        this.calendar = new Calendar('#calendar', {
            mcount: 3,
            date: new Moment
        });
        new CalendarBehavior(this.calendar);
        return new DayBehavior(this.calendar);
    });

}).call(this);
