package scalar

import (
	"fmt"
	"github.com/99designs/gqlgen/graphql"
	"io"
	"strconv"
	"time"
)

func MarshalDOB(s time.Time) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, strconv.Quote(s.Format("02/01/2006")))
	})
}

func UnmarshalDOB(v interface{}) (time.Time, error) {
	if v == nil {
		return time.Time{}, nil
	}
	s, ok := v.(string)
	if !ok {
		return time.Time{}, fmt.Errorf("%T is not a string", v)
	}
	return time.Parse("02/01/2006", s)
}
